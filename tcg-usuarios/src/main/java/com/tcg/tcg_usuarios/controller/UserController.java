package com.tcg.tcg_usuarios.controller;

import com.tcg.tcg_usuarios.model.User;
import com.tcg.tcg_usuarios.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {
    
    private final UserService userService;
    

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        log.info("Obteniendo perfil para usuario: {}", email);
        
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("nombreCompleto", user.getNombreCompleto());
        profile.put("correoElectronico", user.getCorreoElectronico());
        profile.put("role", user.getRole());
        profile.put("fechaRegistro", user.getFechaRegistro());
        
        return ResponseEntity.ok(profile);
    }
    

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        log.info("Acceso al dashboard por usuario: {}", email);
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Bienvenido al dashboard de usuario");
        response.put("usuario", email);
        
        return ResponseEntity.ok(response);
    }
}