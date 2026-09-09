package br.com.gui.usersmvc.service;

import br.com.gui.usersmvc.controller.CreateUserDto;
import br.com.gui.usersmvc.controller.UpdateUserDto;
import br.com.gui.usersmvc.entity.User;
import br.com.gui.usersmvc.repository.UserRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID createUser(CreateUserDto createUserDto) {

        var entity = new User(
                createUserDto.username(),
                createUserDto.email(),
                createUserDto.password()
        );

        var userSaved = userRepository.save(entity);

        return userSaved.getUserId();
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(UUID.fromString(userId));
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public void deleteById(String userId){
        var id = UUID.fromString(userId);

        var userExists = userRepository.existsById(id);

        if (userExists){
            userRepository.deleteById(id);
        }
    }

    public void updateUserById(String userId,
                               UpdateUserDto updateUserDto) {
        var id = UUID.fromString(userId);

        var userEntity = userRepository.findById(id);

        if (userEntity.isPresent()){
            var user = userEntity.get();

            if(updateUserDto.username() != null){
                user.setUsername(updateUserDto.username());
            }

            if(updateUserDto.password() != null){
                user.setPassword(updateUserDto.password());
            }

            userRepository.save(user);

        }
    }
}
