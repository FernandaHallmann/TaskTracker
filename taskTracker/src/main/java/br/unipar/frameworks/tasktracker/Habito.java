package br.unipar.frameworks.tasktracker;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
public class Habito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    private Long usuarioId;

    public Habito() {}

    public Habito(String descricao, Long usuarioId) {
        this.descricao = descricao;
        this.usuarioId = usuarioId;
    }
}