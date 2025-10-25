package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.UserRole;
import br.edu.ifrs.canoas.papillon_clinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Service
public class AuthorizationService implements UserDetailsService {
    @Autowired
    UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    public User registerUser(String login) throws Exception {
        Optional<User> oldUser = repository.findByLogin(login);
        if (oldUser.isPresent()) {
            throw new Exception("Usuário com esse CPF já existe");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = encoder.encode("4321");
        User user = new User(login, password, UserRole.USER);

        return repository.save(user);
    }

}