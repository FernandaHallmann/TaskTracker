package br.unipar.frameworks.tasktracker.repository;

import br.unipar.frameworks.tasktracker.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {}
