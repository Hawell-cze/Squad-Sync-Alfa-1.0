package cz.hawell.squadsync.repository;

import cz.hawell.squadsync.entity.SessionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionsRepository extends JpaRepository<SessionsEntity, Integer> {
    Optional<SessionsEntity> findByToken(String token);
    List<SessionsEntity> findByCommander_Id(int commanderId);
}
