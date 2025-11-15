package com.tcg.tcg_backend.Controller;

import com.tcg.tcg_backend.Model.Product;
import com.tcg.tcg_backend.Service.ProductService;
import com.tcg.tcg_backend.Service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService service;
    private final FileStorageService fileStorageService;

    public ProductController(ProductService service, FileStorageService fileStorageService) {
        this.service = service;
        this.fileStorageService = fileStorageService;
    }

    // ===== CRUD JSON SIMPLE (ya lo tenías) =====

    @GetMapping
    public List<Product> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        Product p = service.findOne(id);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(p);
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        Product saved = service.save(product);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(
            @PathVariable Long id,
            @RequestBody Product productBody
    ) {
        Product exists = service.findOne(id);
        if (exists == null) {
            return ResponseEntity.notFound().build();
        }

        exists.setNombre(productBody.getNombre());
        exists.setDescripcion(productBody.getDescripcion());
        exists.setPrecio(productBody.getPrecio());
        exists.setImagen(productBody.getImagen());
        exists.setHover(productBody.getHover());
        exists.setOferta(productBody.getOferta());

        Product updated = service.save(exists);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Product exists = service.findOne(id);
        if (exists == null) {
            return ResponseEntity.notFound().build();
        }

        // Borrar archivos asociados si existen
        fileStorageService.deleteByUrl(exists.getImagen());
        fileStorageService.deleteByUrl(exists.getHover());

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ===== NUEVO: crear producto subiendo imagen al servidor =====

    @PostMapping(
            path = "/con-imagen",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Product> createWithImage(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam int precio,
            @RequestParam("imagen") MultipartFile imagen,
            @RequestParam(required = false) String oferta,
            @RequestParam(name = "hover", required = false) MultipartFile hover
    ) {
        try {
            // Guardar imagen principal en disco
            String imageUrl = fileStorageService.saveProductImage(imagen);

            String hoverUrl = null;
            if (hover != null && !hover.isEmpty()) {
                hoverUrl = fileStorageService.saveProductImage(hover);
            }

            Product p = new Product();
            p.setNombre(nombre);
            p.setDescripcion(descripcion);
            p.setPrecio(precio);
            p.setImagen(imageUrl);  // ej: /uploads/uuid-img.png
            p.setHover(hoverUrl);
            p.setOferta(oferta);

            Product saved = service.save(p);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ===== NUEVO: actualizar producto con opción de nuevas imágenes =====

    @PutMapping(
            path = "/{id}/con-imagen",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Product> updateWithImage(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam int precio,
            @RequestParam(required = false) String oferta,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen,
            @RequestParam(name = "hover", required = false) MultipartFile hover
    ) {
        Product exists = service.findOne(id);
        if (exists == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Actualizar datos básicos
            exists.setNombre(nombre);
            exists.setDescripcion(descripcion);
            exists.setPrecio(precio);
            exists.setOferta(oferta);

            // Si viene nueva imagen principal
            if (imagen != null && !imagen.isEmpty()) {
                // Borramos la anterior si había
                fileStorageService.deleteByUrl(exists.getImagen());
                // Guardamos la nueva
                String newImageUrl = fileStorageService.saveProductImage(imagen);
                exists.setImagen(newImageUrl);
            }

            // Si viene nueva imagen hover
            if (hover != null && !hover.isEmpty()) {
                fileStorageService.deleteByUrl(exists.getHover());
                String newHoverUrl = fileStorageService.saveProductImage(hover);
                exists.setHover(newHoverUrl);
            }

            Product updated = service.save(exists);
            return ResponseEntity.ok(updated);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}