package com.tcg.tcg_backend.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nombre;

    @NotBlank
    private String descripcion;

    // En BD lo guardamos como INT (precio en pesos)
    private int precio;

    // URL de la imagen principal
    @NotBlank
    private String imagen;

    // URL de imagen hover (puede ser null)
    private String hover;

    // Ej: "oferta", "nuevo", etc. (puede ser null)
    private String oferta;
}
