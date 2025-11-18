package com.tcg.tcg_usuarios.controller;

import com.tcg.tcg_usuarios.model.User;
import com.tcg.tcg_usuarios.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AdminController {
    
    private final UserRepository userRepository;
    

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminPanel(Authentication authentication) {
        String email = authentication.getName();
        log.info("Acceso al panel de admin por: {}", email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Bienvenido al panel de administrador");
        response.put("usuario", email);
        response.put("rol", authentication.getAuthorities());
        
        return ResponseEntity.ok(response);
    }
    

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Obteniendo lista de todos los usuarios");
        
        List<User> users = userRepository.findAll();
        
        users.forEach(user -> user.setPassword(null));
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        log.info("Obteniendo estadísticas del sistema");
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", userRepository.count());
        stats.put("mensaje", "Estadísticas del sistema");
        
        return ResponseEntity.ok(stats);
    }
    

    @SuppressWarnings("null")
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        userRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Usuario eliminado exitosamente");
        
        return ResponseEntity.ok(response);
    }
}