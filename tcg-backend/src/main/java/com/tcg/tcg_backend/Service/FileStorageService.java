package com.tcg.tcg_backend.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveProductImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Archivo vacío");
        }

        // Limpiamos el nombre original
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        // Generamos nombre único
        String filename = UUID.randomUUID() + "-" + originalFilename;

        // Carpeta base absoluta
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();

        // Creamos la carpeta si no existe
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Ruta final del archivo
        Path filePath = uploadPath.resolve(filename);

        // Guardamos el archivo
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Devolvemos la ruta pública (lo que verá el front)
        // Ej: /uploads/uuid-nombre.png
        return "/uploads/" + filename;
    }

    /**
     * Borra un archivo dado su URL pública (ej: /uploads/uuid-nombre.png)
     */
    public void deleteByUrl(String url) {
        if (url == null || url.isBlank()) {
            return;
        }

        // Esperamos algo como "/uploads/archivo.ext"
        String prefix = "/uploads/";
        if (!url.startsWith(prefix)) {
            // Si el formato es raro, no nos arriesgamos
            return;
        }

        String filename = url.substring(prefix.length());

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        Path filePath = uploadPath.resolve(filename);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // En un caso real: log.warn("No se pudo borrar el archivo: {}", filePath, e);
        }
    }
}