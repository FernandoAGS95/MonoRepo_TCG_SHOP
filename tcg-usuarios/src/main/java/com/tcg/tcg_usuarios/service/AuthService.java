package com.tcg.tcg_usuarios.service;

import com.tcg.tcg_usuarios.dto.AuthResponse;
import com.tcg.tcg_usuarios.dto.LoginRequest;
import com.tcg.tcg_usuarios.dto.RegisterRequest;
import com.tcg.tcg_usuarios.model.Role;
import com.tcg.tcg_usuarios.model.User;
import com.tcg.tcg_usuarios.repository.UserRepository;
import com.tcg.tcg_usuarios.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    

    @SuppressWarnings("null")
    public AuthResponse register(RegisterRequest request) {
        log.info("Intentando registrar usuario con correo: {}", request.getCorreoElectronico());
        
        if (!request.getPassword().equals(request.getConfirmarPassword())) {
            log.warn("Las contraseñas no coinciden para el correo: {}", request.getCorreoElectronico());
            throw new RuntimeException("Las contraseñas no coinciden");
        }
        
        if (userRepository.existsByCorreoElectronico(request.getCorreoElectronico())) {
            log.warn("Intento de registro con correo ya existente: {}", request.getCorreoElectronico());
            throw new RuntimeException("El correo electrónico ya está registrado");
        }
        
        User user = User.builder()
                .nombreCompleto(request.getNombreCompleto())
                .correoElectronico(request.getCorreoElectronico())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Por defecto es USER
                .enabled(true)
                .build();
        
        userRepository.save(user);
        log.info("Usuario registrado exitosamente: {}", user.getCorreoElectronico());
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getCorreoElectronico());
        String token = jwtUtil.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(token)
                .correoElectronico(user.getCorreoElectronico())
                .nombreCompleto(user.getNombreCompleto())
                .role(user.getRole().name())
                .mensaje("Usuario registrado exitosamente")
                .build();
    }
    

    public AuthResponse login(LoginRequest request) {
        log.info("Intento de login para el correo: {}", request.getCorreoElectronico());
        
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getCorreoElectronico(),
                    request.getPassword()
                )
            );
            
            User user = userRepository.findByCorreoElectronico(request.getCorreoElectronico())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getCorreoElectronico());
            
            String token = jwtUtil.generateToken(userDetails);
            
            log.info("Login exitoso para el usuario: {}", user.getCorreoElectronico());
            
            return AuthResponse.builder()
                    .token(token)
                    .correoElectronico(user.getCorreoElectronico())
                    .nombreCompleto(user.getNombreCompleto())
                    .role(user.getRole().name())
                    .mensaje("Login exitoso")
                    .build();
                    
        } catch (Exception e) {
            log.error("Error en login para el correo: {}", request.getCorreoElectronico(), e);
            throw new RuntimeException("Credenciales incorrectas");
        }
    }
}