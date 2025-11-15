package com.tcg.tcg_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


// Poner (exclude = { DataSourceAutoConfiguration.class })
// Cuando no tengamos el una base de datos para evitar que se caiga el proyecto

@SpringBootApplication
public class TcgBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TcgBackendApplication.class, args);
	}

}
