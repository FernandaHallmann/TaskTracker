package br.unipar.frameworks.tasktracker;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
public class Tarefa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    private Timestamp dataInicio;
    private Timestamp dataLimite;
    private Boolean concluido;
    private Long usuarioId;

    public Tarefa() {}

    public Tarefa(String descricao, Timestamp dataInicio, Timestamp dataLimite, Boolean concluido, Long usuarioId) {
        this.descricao = descricao;
        this.dataInicio = dataInicio;
        this.dataLimite = dataLimite;
        this.concluido = concluido;
        this.usuarioId = usuarioId;
    }
}