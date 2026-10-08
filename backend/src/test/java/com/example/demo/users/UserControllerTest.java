package com.example.demo.users;


import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserControllerTest {

    private final UserRepository repo = mock(UserRepository.class);
    private final UserController controller = new UserController(repo);

    private User user(String name) {
        User u = new User();
        u.setName(name);
        u.setEmail(name + "@test.com");
        u.setRole("USER");
        return u;
    }

    @Test
    void listReturnsAllUsers() {
        when(repo.findAll()).thenReturn(List.of(user("alice"), user("bob")));
        assertEquals(2, controller.list().size());
    }

    @Test
    void createForcesNullIdAndSaves() {
        User input = user("alice");
        input.setId(99L);
        when(repo.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User saved = controller.create(input);

        assertNull(saved.getId());
        verify(repo).save(input);
    }

    @Test
    void updateUnknownUserReturns404() {
        when(repo.findById(1L)).thenReturn(Optional.empty());
        ResponseEntity<User> res = controller.update(1L, user("alice"));
        assertEquals(HttpStatus.NOT_FOUND, res.getStatusCode());
    }

    @Test
    void deleteUnknownUserReturns404() {
        when(repo.existsById(1L)).thenReturn(false);
        assertEquals(HttpStatus.NOT_FOUND, controller.delete(1L).getStatusCode());
        verify(repo, never()).deleteById(any());
    }
}
