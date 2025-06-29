package cz.hawell.squadsync.repository;

import cz.hawell.squadsync.entity.SessionUserStatusesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionUserStatusesRepository extends JpaRepository<SessionUserStatusesEntity, Integer> {
    List<SessionUserStatusesEntity> findBySession_Token(String token);
    List<SessionUserStatusesEntity> findByUser_Id(int userId);
    Optional<SessionUserStatusesEntity> findByUser_IdAndSession_Token(int userId, String token);

}
