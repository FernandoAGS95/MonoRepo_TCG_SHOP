package com.tcg.tcg_usuarios.service;

import com.tcg.tcg_usuarios.model.User;
import com.tcg.tcg_usuarios.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    

    @SuppressWarnings("null")
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    

    public Optional<User> getUserByEmail(String correoElectronico) {
        return userRepository.findByCorreoElectronico(correoElectronico);
    }
    

    @SuppressWarnings("null")
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    

    @SuppressWarnings("null")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    

    public long countUsers() {
        return userRepository.count();
    }
    

    public boolean existsByEmail(String correoElectronico) {
        return userRepository.existsByCorreoElectronico(correoElectronico);
    }
}