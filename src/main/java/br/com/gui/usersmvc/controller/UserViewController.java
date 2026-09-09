package br.com.gui.usersmvc.controller;

import br.com.gui.usersmvc.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/users")
public class UserViewController {

    private final UserService userService;

    public UserViewController(UserService userService) {
        this.userService = userService;
    }

    // Listar usuários e exibir formulário
    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.getUsers());
        model.addAttribute("newUser", new CreateUserDto("", "", ""));
        return "users"; // renderiza templates/users.html
    }

    // Processar criação de usuário pelo formulário
    @PostMapping
    public String createUser(@ModelAttribute("newUser") CreateUserDto createUserDto) {
        userService.createUser(createUserDto);
        return "redirect:/users";
    }

    // Deletar usuário pelo clique no botão
    @PostMapping("/delete/{userId}")
    public String deleteUser(@PathVariable("userId") String userId) {
        userService.deleteById(userId);
        return "redirect:/users";
    }
}
