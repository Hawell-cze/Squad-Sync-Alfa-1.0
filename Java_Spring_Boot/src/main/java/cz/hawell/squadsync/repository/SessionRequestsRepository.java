package cz.hawell.squadsync.repository;

import cz.hawell.squadsync.entity.SessionRequestsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRequestsRepository extends JpaRepository<SessionRequestsEntity, Integer> {
    List<SessionRequestsEntity> findBySession_Token(String token);
    List<SessionRequestsEntity> findByUser_Id(int userId);
}
