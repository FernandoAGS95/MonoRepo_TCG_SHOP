package com.tcg.tcg_backend.Controller;
import com.tcg.tcg_backend.Model.Banner;
import com.tcg.tcg_backend.Service.BannerService;
import com.tcg.tcg_backend.Service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "*")
public class BannerController {

    private final BannerService service;
    private final FileStorageService fileStorageService;

    public BannerController(BannerService service, FileStorageService fileStorageService) {
        this.service = service;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<Banner> getAll() {
        return service.findAll();
    }

    // Crear banner con imagen
    @PostMapping(
            path = "/con-imagen",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Banner> createWithImage(
            @RequestParam("imagen") MultipartFile imagen,
            @RequestParam(value = "titulo", required = false) String titulo
    ) {
        try {
            String url = fileStorageService.saveProductImage(imagen); // devuelve /uploads/...

            Banner b = new Banner();
            b.setUrl(url);
            b.setTitulo(titulo);

            Banner saved = service.save(b);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Actualizar título y/o imagen
    @PutMapping(
            path = "/{id}/con-imagen",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Banner> updateWithImage(
            @PathVariable Long id,
            @RequestParam(value = "titulo", required = false) String titulo,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) {
        Banner exists = service.findOne(id);
        if (exists == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            if (titulo != null) {
                exists.setTitulo(titulo);
            }

            if (imagen != null && !imagen.isEmpty()) {
                // borrar imagen vieja
                fileStorageService.deleteByUrl(exists.getUrl());
                // guardar nueva
                String url = fileStorageService.saveProductImage(imagen);
                exists.setUrl(url);
            }

            Banner saved = service.save(exists);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Banner exists = service.findOne(id);
        if (exists == null) {
            return ResponseEntity.notFound().build();
        }

        // borrar archivo asociado
        fileStorageService.deleteByUrl(exists.getUrl());
        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}