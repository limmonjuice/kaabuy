package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Find by order ID
    List<OrderItem> findByOrder_OrderId(Integer orderId);

    // Find by product ID
    List<OrderItem> findByProduct_ProductId(Integer productId);
}
