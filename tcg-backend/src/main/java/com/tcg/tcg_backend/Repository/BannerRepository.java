package com.tcg.tcg_backend.Repository;

import com.tcg.tcg_backend.Model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerRepository extends JpaRepository<Banner, Long> {
}