"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [aba, setAba] = useState("mov");
  const [movs, setMovs] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<number | null>(null);

  const [form, setForm] = useState({
    data: "",
    codigo: "",
    nome: "",
    tipo: "ENTRADA",
    deposito: "CONTEINER",
    quantidade: "",
    responsavel: "",
    motivo: "",
  });

  // carregar
  useEffect(() => {
    const dados = localStorage.getItem("movs");
    if (dados) setMovs(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem("movs", JSON.stringify(movs));
  }, [movs]);

  // formatar data
  const formatarData = (valor: string) => {
    let v = valor.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
    return v;
  };

  // salvar / editar
  const salvar = () => {
    if (!form.data || !form.nome || !form.quantidade) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    if (editando !== null) {
      const novo = [...movs];
      novo[editando] = { ...form, id: novo[editando].id };
      setMovs(novo);
      setEditando(null);
    } else {
      setMovs([
        {
          ...form,
          quantidade: Number(form.quantidade),
          id: Date.now() + Math.random(),
        },
        ...movs,
      ]);
    }

    setForm({
      data: "",
      codigo: "",
      nome: "",
      tipo: "ENTRADA",
      deposito: "CONTEINER",
      quantidade: "",
      responsavel: "",
      motivo: "",
    });
  };

  // editar
  const editar = (index: number) => {
    setForm(movs[index]);
    setEditando(index);
  };

  // excluir
  const excluir = (id: number) => {
    setMovs(movs.filter((m) => m.id !== id));
  };

  // calcular estoque
  const calcular = (dep: string) => {
    const est: any = {};

    movs.forEach((m) => {
      if (m.deposito !== dep) return;

      const chave = m.codigo || m.nome;

      if (!est[chave]) est[chave] = { nome: m.nome, qtd: 0 };

      if (m.tipo === "ENTRADA") est[chave].qtd += m.quantidade;
      else est[chave].qtd -= m.quantidade;
    });

    return est;
  };

  // tabela estoque
  const tabelaEstoque = (dep: string) => {
    const data = calcular(dep);

    return Object.keys(data)
      .filter((cod) => {
        const nome = data[cod].nome || "";
        return (
          cod.toLowerCase().includes(busca.toLowerCase()) ||
          nome.toLowerCase().includes(busca.toLowerCase())
        );
      })
      .map((cod, i) => (
        <tr key={cod + i}>
          <td style={td}>{cod}</td>
          <td style={td}>{data[cod].nome}</td>
          <td style={{ ...td, fontWeight: "bold" }}>{data[cod].qtd}</td>
        </tr>
      ));
  };

  return (
    <div style={{ display: "flex", fontFamily: "Segoe UI" }}>
      {/* MENU */}
      <div style={menu}>
        <h2>📦 Estoque</h2>

        <button style={btnMenu} onClick={() => setAba("mov")}>
          Movimentação
        </button>
        <button style={btnMenu} onClick={() => setAba("cont")}>
          Container
        </button>
        <button style={btnMenu} onClick={() => setAba("esc")}>
          Escritório
        </button>
      </div>

      {/* CONTEÚDO */}
      <div style={conteudo}>
        {aba === "mov" && (
          <>
            <h2>Movimentação</h2>

            <div style={card}>
              <div style={grid}>
                <input
                  placeholder="Data"
                  value={form.data}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      data: formatarData(e.target.value),
                    })
                  }
                />

                <input
                  placeholder="Código"
                  value={form.codigo}
                  onChange={(e) =>
                    setForm({ ...form, codigo: e.target.value })
                  }
                />

                <input
                  placeholder="Produto"
                  value={form.nome}
                  onChange={(e) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                />

                <select
                  value={form.tipo}
                  onChange={(e) =>
                    setForm({ ...form, tipo: e.target.value })
                  }
                >
                  <option>ENTRADA</option>
                  <option>SAIDA</option>
                </select>

                <select
                  value={form.deposito}
                  onChange={(e) =>
                    setForm({ ...form, deposito: e.target.value })
                  }
                >
                  <option>CONTEINER</option>
                  <option>ESCRITORIO</option>
                </select>

                <input
                  type="number"
                  placeholder="Quantidade"
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm({ ...form, quantidade: e.target.value })
                  }
                />

                <input
                  placeholder="Responsável"
                  value={form.responsavel}
                  onChange={(e) =>
                    setForm({ ...form, responsavel: e.target.value })
                  }
                />

                <input
                  placeholder="Motivo"
                  value={form.motivo}
                  onChange={(e) =>
                    setForm({ ...form, motivo: e.target.value })
                  }
                />
              </div>

              <button style={btnSalvar} onClick={salvar}>
                {editando !== null ? "Atualizar" : "Salvar"}
              </button>
            </div>

            <table style={tabela}>
              <thead>
                <tr>
                  <th style={th}>Data</th>
                  <th style={th}>Código</th>
                  <th style={th}>Produto</th>
                  <th style={th}>Tipo</th>
                  <th style={th}>Depósito</th>
                  <th style={th}>Qtd</th>
                  <th style={th}>Responsável</th>
                  <th style={th}>Motivo</th>
                  <th style={th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {movs.map((m, i) => (
                  <tr key={m.id || i}>
                    <td style={td}>{m.data}</td>
                    <td style={td}>{m.codigo}</td>
                    <td style={td}>{m.nome}</td>
                    <td style={td}>{m.tipo}</td>
                    <td style={td}>{m.deposito}</td>
                    <td style={td}>{m.quantidade}</td>
                    <td style={td}>{m.responsavel}</td>
                    <td style={td}>{m.motivo}</td>
                    <td style={td}>
                      <button
                        style={btnEdit}
                        onClick={() => editar(i)}
                      >
                        Editar
                      </button>
                      <button
                        style={btnExcluir}
                        onClick={() => excluir(m.id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(aba === "cont" || aba === "esc") && (
          <>
            <h2>
              Estoque {aba === "cont" ? "CONTEINER" : "ESCRITORIO"}
            </h2>

            <input
              placeholder="Buscar por código ou nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ marginBottom: 10, padding: 8 }}
            />

            <table style={tabela}>
              <thead>
                <tr>
                  <th style={th}>Código</th>
                  <th style={th}>Produto</th>
                  <th style={th}>Quantidade</th>
                </tr>
              </thead>

              <tbody>
                {tabelaEstoque(
                  aba === "cont" ? "CONTEINER" : "ESCRITORIO"
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

// estilos
const menu = {
  width: 220,
  background: "#0f172a",
  color: "#fff",
  height: "100vh",
  padding: 20,
};

const conteudo = {
  flex: 1,
  padding: 20,
  background: "#f1f5f9",
};

const btnMenu = {
  display: "block",
  width: "100%",
  marginBottom: 10,
  padding: 10,
  background: "#1e293b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};

const btnSalvar = {
  marginTop: 10,
  padding: 10,
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};

const btnEdit = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: 5,
  marginRight: 5,
  borderRadius: 4,
};

const btnExcluir = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: 5,
  borderRadius: 4,
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse" as const,
  background: "#fff",
};

const th = {
  padding: 10,
  borderBottom: "1px solid #ddd",
  background: "#e2e8f0",
  textAlign: "left" as const,
};

const td = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
};