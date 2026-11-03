package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.StockRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRecordRepository extends JpaRepository<StockRecord, Integer> {

    List<StockRecord> findByProduct_ProductId(Integer productId);

    List<StockRecord> findBySupplier_SupplierId(Integer supplierId);

    List<StockRecord> findByRecordType(String recordType);

    List<StockRecord> findAllByOrderByDeliveryDateDescRecordIdDesc();

    org.springframework.data.domain.Page<StockRecord> findAllByOrderByDeliveryDateDescRecordIdDesc(
            org.springframework.data.domain.Pageable pageable);
}
