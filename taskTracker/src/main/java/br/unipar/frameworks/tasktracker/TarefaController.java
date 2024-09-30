// src/main/java/br/unipar/frameworksweb/slitherunipar/GameController.java
package br.unipar.frameworks.tasktracker;

import br.unipar.frameworks.tasktracker.repository.HabitoHistoricoRepository;
import br.unipar.frameworks.tasktracker.repository.HabitoRepository;
import br.unipar.frameworks.tasktracker.repository.TarefaRepository;
import br.unipar.frameworks.tasktracker.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@EnableWebSocketMessageBroker
public class TarefaController {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HabitoRepository habitoRepository;

    @Autowired
    private HabitoHistoricoRepository habitoHistoricoRepository;

    @MessageMapping("/tarefas/listar-todos")
    @SendTo("/topic/tarefas")
    public List<Tarefa> getTasks() {
        return tarefaRepository.findAll();
    }

    @MessageMapping("/tarefas/criar")
    @SendTo("/topic/tarefas")
    public Tarefa criarTarefa(@RequestBody Tarefa tarefa) {
        if (tarefa.getUsuarioId() == null) {
            throw new RuntimeException("Usuário ID não pode ser nulo");
        }
        tarefaRepository.save(tarefa);
        return tarefa;
    }

    @MessageMapping("/tarefas/concluir")
    @SendTo("/topic/tarefas")
    public Tarefa concluirTarefa(@Payload Long tarefaId) {
        Tarefa tarefa = tarefaRepository.findById(tarefaId).orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        tarefa.setConcluido(true);
        tarefaRepository.save(tarefa);
        return tarefa;
    }

    @MessageMapping("/habitos/criar")
    @SendTo("/topic/habitos")
    public Habito criarHabito(@RequestBody Habito habito) {
        if (habito.getUsuarioId() == null) {
            throw new RuntimeException("Usuário ID não pode ser nulo");
        }
        habitoRepository.save(habito);
        return habito;
    }

    @MessageMapping("/habitos/listar-todos")
    @SendTo("/topic/habitos")
    public List<Habito> listarHabitos() {
        return habitoRepository.findAll();
    }

    @MessageMapping("/habitos/historico")
    @SendTo("/topic/habitos")
    public HabitoHistorico registrarHistoricoHabito(@RequestBody HabitoHistorico habitoHistorico) {
        habitoHistoricoRepository.save(habitoHistorico);
        return habitoHistorico;
    }

    @MessageMapping("/usuarios/listar-todos")
    @SendTo("/topic/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @MessageMapping("/usuarios/criar")
    @SendTo("/topic/usuarios")
    public Usuario criarUsuario(@Payload Usuario usuario) {
        usuarioRepository.save(usuario);
        return usuario;
    }
}