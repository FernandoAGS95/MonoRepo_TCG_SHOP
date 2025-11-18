package com.tcg.tcg_usuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    

    @Builder.Default
    private String tipo = "Bearer";
    

    private String correoElectronico;
    

    private String nombreCompleto;
    

    private String role;
    

    private String mensaje;
}