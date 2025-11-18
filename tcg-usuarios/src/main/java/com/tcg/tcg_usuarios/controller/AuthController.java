package com.tcg.tcg_usuarios.controller;

import com.tcg.tcg_usuarios.dto.AuthResponse;
import com.tcg.tcg_usuarios.dto.ErrorResponse;
import com.tcg.tcg_usuarios.dto.LoginRequest;
import com.tcg.tcg_usuarios.dto.RegisterRequest;
import com.tcg.tcg_usuarios.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Petición de registro recibida para: {}", request.getCorreoElectronico());
        
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Error en registro: {}", e.getMessage());
            throw e;
        }
    }
    

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Petición de login recibida para: {}", request.getCorreoElectronico());
        
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error en login: {}", e.getMessage());
            throw new RuntimeException("Credenciales incorrectas");
        }
    }
    

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.warn("Errores de validación: {}", errors);
        return ResponseEntity.badRequest().body(errors);
    }
    

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        log.error("Error de runtime: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .mensaje(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        
        return ResponseEntity.badRequest().body(error);
    }
}