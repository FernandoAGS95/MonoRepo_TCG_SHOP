package com.tcg.tcg_usuarios.config;

import com.tcg.tcg_usuarios.model.Role;
import com.tcg.tcg_usuarios.model.User;
import com.tcg.tcg_usuarios.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        log.info("Ejecutando inicialización de datos...");
        
        createAdminUser();
        
        log.info("Inicialización de datos completada");
    }

    @SuppressWarnings("null")
    private void createAdminUser() {
        String adminEmail = "admin@tcg.cl";
        
        if (!userRepository.existsByCorreoElectronico(adminEmail)) {
            User admin = User.builder()
                    .nombreCompleto("Administrador TCG")
                    .correoElectronico(adminEmail)
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            
            userRepository.save(admin);
            
            log.info("Usuario administrador creado:");
            log.info("Email: {}", adminEmail);
            log.info("Password: admin");
            log.info("Rol: ADMIN");
        } else {
            log.info("Usuario administrador ya existe: {}", adminEmail);
        }
    }
}