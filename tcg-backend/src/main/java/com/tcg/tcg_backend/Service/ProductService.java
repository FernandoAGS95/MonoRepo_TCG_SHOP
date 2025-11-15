package com.tcg.tcg_backend.Service;

import com.tcg.tcg_backend.Model.Product;
import com.tcg.tcg_backend.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> findAll() {
        return repo.findAll();
    }

    public Product findOne(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Product save(Product product) {
        return repo.save(product);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}