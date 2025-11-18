package com.tcg.tcg_usuarios.repository;

import com.tcg.tcg_usuarios.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    

    Optional<User> findByCorreoElectronico(String correoElectronico);
    

    boolean existsByCorreoElectronico(String correoElectronico);
}