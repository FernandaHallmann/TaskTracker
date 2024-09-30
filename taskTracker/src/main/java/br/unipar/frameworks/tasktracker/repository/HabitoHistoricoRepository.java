package br.unipar.frameworks.tasktracker.repository;

import br.unipar.frameworks.tasktracker.HabitoHistorico;
import br.unipar.frameworks.tasktracker.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitoHistoricoRepository extends JpaRepository<HabitoHistorico, Long> {}
