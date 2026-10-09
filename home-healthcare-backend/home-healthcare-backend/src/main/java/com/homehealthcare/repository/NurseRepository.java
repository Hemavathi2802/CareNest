
package com.homehealthcare.repository;

import com.homehealthcare.entity.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface NurseRepository extends JpaRepository<Nurse, Long> {

    Optional<Nurse> findByUserId(Long userId);

    List<Nurse> findByUserIdIn(Collection<Long> userIds);

}