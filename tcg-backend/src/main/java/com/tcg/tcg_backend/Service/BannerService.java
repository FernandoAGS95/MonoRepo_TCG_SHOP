package com.tcg.tcg_backend.Service;

import com.tcg.tcg_backend.Model.Banner;
import com.tcg.tcg_backend.Repository.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {

    private final BannerRepository repository;

    public BannerService(BannerRepository repository) {
        this.repository = repository;
    }

    public List<Banner> findAll() {
        return repository.findAll();
    }

    public Banner findOne(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Banner save(Banner banner) {
        return repository.save(banner);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}