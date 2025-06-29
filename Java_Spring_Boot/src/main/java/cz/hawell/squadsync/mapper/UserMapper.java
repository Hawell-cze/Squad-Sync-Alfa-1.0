package cz.hawell.squadsync.mapper;

import cz.hawell.squadsync.dto.UserDTO;
import cz.hawell.squadsync.entity.UsersEntity;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    UserDTO toDto(UsersEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdSessions", ignore = true)
    UsersEntity toEntity(UserDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    UsersEntity updateEntity(UserDTO dto, @MappingTarget UsersEntity entity);
}
