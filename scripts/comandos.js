/**
 * Guía de Tareas y Tabla de Comandos - comandos.js
 * Renders the complete table of chat commands, aliases, examples, and descriptions
 * with search filtering, category tabs, and 1-click copy buttons.
 */

(function () {
	"use strict";

	const tbodyEl = document.getElementById("commands-tbody");
	const searchInputEl = document.getElementById("cmd-search-input");
	const categoryFiltersEl = document.getElementById("cmd-category-filters");
	const toastEl = document.getElementById("toast");
	const toastTextEl = document.getElementById("toast-text");

	const cmds = (typeof configs !== "undefined" && configs.commands) ? configs.commands : {};

	const commandEntries = [
		{
			main: "!add <tarea>",
			copyText: "!add ",
			category: "Tareas",
			aliases: cmds.addTaskCommands || ["!task", "!add", "!todo", "!tarea"],
			example: "!add Leer cap 1, Hacer resumen",
			description: "Agrega una tarea (o varias separadas por coma) a tu lista. Si no tenías ninguna activa, la primera arranca con el reloj [⏱ 0m].",
		},
		{
			main: "!listo",
			copyText: "!listo",
			category: "Tareas",
			aliases: cmds.finishTaskCommands || ["!done", "!listo", "!completado", "!terminado"],
			example: "!listo",
			description: "Marca tu tarea activa (#1) como completada, detiene el reloj, te suma 1 ✅Check por cada minuto trabajado (x1.25 si sos Suscriptor ⭐) y activa la siguiente tarea de tu cola.",
		},
		{
			main: "!next [nueva tarea]",
			copyText: "!next",
			category: "Tareas",
			aliases: cmds.nextTaskCommands || ["!next", "!sig", "!siguiente"],
			example: "!sig Repasar fórmulas",
			description: "Completa tu tarea activa actual (sumando tus ✅Checks) y pasa a la siguiente en tu lista. Si escribís una tarea al lado, también la agrega a tu cola.",
		},
		{
			main: "!focus <número>",
			copyText: "!focus 2",
			category: "Tareas",
			aliases: cmds.focusTaskCommands || ["!focus", "!cambiartarea", "!tareaactual", "!foco"],
			example: "!focus 3",
			description: "Pone la tarea número <número> como tu nueva tarea activa (#1), mueve la tarea que estabas haciendo al puesto #2 (la siguiente), y transfiere el tiempo acumulado de la sesión para que no pierdas minutos.",
		},
		{
			main: "!afk",
			copyText: "!afk",
			category: "Tareas",
			aliases: cmds.afkCommands || ["!afk", "!break", "!pausa", "!pause", "!descanso"],
			example: "!afk",
			description: "Pausa el contador de tu tarea activa mostrando [⏸AFK ] para que no pierdas tus minutos si salís un rato. Cuando vuelvas a escribir en el chat se retoma automáticamente.",
		},
		{
			main: "!edit [número] <texto>",
			copyText: "!edit ",
			category: "Tareas",
			aliases: cmds.editTaskCommands || ["!edit", "!editar", "!cambiar", "!rename"],
			example: "!edit 2 Resolver guía 4",
			description: "Modifica el texto de tu tarea activa (si no ponés número) o de la tarea en la posición indicada sin reiniciar tu reloj.",
		},
		{
			main: "!borrar [número]",
			copyText: "!borrar",
			category: "Tareas",
			aliases: cmds.deleteTaskCommands || ["!borrar", "!eliminar", "!remove", "!delete"],
			example: "!borrar 2",
			description: "Elimina la tarea número [número] de tu cola, o tu tarea activa si no indicás número. Si borrás la tarea activa, se cancela su reloj sin sumar puntos y la siguiente arranca desde 0m.",
		},
		{
			main: "!check [@usuario]",
			copyText: "!check",
			category: "Tareas",
			aliases: cmds.checkCommands || ["!check", "!mitarea", "!mistareas", "!mytasks"],
			example: "!check",
			description: "El bot te dice en el chat cuál es tu tarea activa actual, cuántos minutos llevás en el reloj [⏱ Xm], cuántas tareas tenés en cola y tu saldo de ✅Checks.",
		},
		{
			main: "!puntos [@usuario]",
			copyText: "!puntos",
			category: "Checks",
			aliases: cmds.pointsCommands || ["!puntos", "!points", "!mispuntos", "!saldo"],
			example: "!puntos",
			description: "Muestra en el chat cuántos ✅Checks acumulados tenés disponibles para canjear en la tienda (o cuántos tiene otro compañero si escribís su @usuario).",
		},
		{
			main: "!tienda",
			copyText: "!tienda",
			category: "Checks",
			aliases: cmds.tiendaCommands || ["!tienda", "!premios", "!catalogo", "!shop"],
			example: "!tienda",
			description: "Muestra en el chat el link a esta página web y cómo canjear las recompensas.",
		},
		{
			main: "!canjear <código>",
			copyText: "!canjear ",
			category: "Checks",
			aliases: cmds.redeemCommands || ["!canjear", "!redeem", "!comprar", "!recompensa"],
			example: "!canjear musica",
			description: "Reclama una recompensa del catálogo usando tus ✅Checks (códigos: pomo, break, musica, vip, sub, robinhood). Queda pendiente de aprobación (si se rechaza, se te devuelven los ✅Checks automáticamente).",
		},
		{
			main: "!donar @usuario <checks>",
			copyText: "!donar @",
			category: "Eventos",
			aliases: cmds.donateCommands || ["!donar", "!regalar", "!transferir", "!donate"],
			example: "!donar @amigo 50",
			description: "Transfiere la cantidad de ✅Checks que elijas desde tu saldo al saldo de otro compañero del stream y muestra una alerta en pantalla.",
		},
		{
			main: "!robinhood",
			copyText: "!canjear robinhood",
			category: "Eventos",
			aliases: cmds.robinhoodCommands || ["!robinhood", "!robin"],
			example: "!canjear robinhood",
			description: "Inicia el evento especial Motín de Robin Hood (cuesta 100 ✅Checks). Abre la convocatoria en el chat para que todos se anoten con !unirse o !robar y se repartan los ✅Checks de Nico Yak en partes iguales.",
		},
		{
			main: "!unirse",
			copyText: "!unirse",
			category: "Eventos",
			aliases: cmds.joinRobinhoodCommands || ["!unirse", "!robar", "!join", "!motin"],
			example: "!unirse",
			description: "Cuando hay un Motín de Robin Hood activo, te suma a la lista de reparto para recibir tu parte del botín de ✅Checks de Nico Yak.",
		},
		{
			main: "!ayuda",
			copyText: "!ayuda",
			category: "Tareas",
			aliases: cmds.helpCommands || ["!ayuda", "!taskhelp", "!tasks", "!comandos", "!help"],
			example: "!ayuda",
			description: "Muestra un resumen rápido en el chat con los comandos principales para agregar, pausar, enfocar y completar tareas.",
		},
	];

	let currentCategory = "all";
	let searchQuery = "";
	let toastTimeout = null;

	function showToast(message) {
		if (!toastEl || !toastTextEl) return;
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTextEl.innerText = message;
		toastEl.classList.add("show");
		toastTimeout = setTimeout(() => {
			toastEl.classList.remove("show");
		}, 2400);
	}

	async function copyToClipboard(text, btnEl) {
		let success = false;
		if (navigator.clipboard && navigator.clipboard.writeText) {
			try {
				await navigator.clipboard.writeText(text);
				success = true;
			} catch (e) {}
		}

		if (!success) {
			try {
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.left = "-9999px";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				success = document.execCommand("copy");
				document.body.removeChild(textArea);
			} catch (err) {}
		}

		if (success && btnEl) {
			const original = btnEl.innerHTML;
			btnEl.classList.add("copied");
			btnEl.innerHTML = "✓ Copiado";
			showToast(`Comando copiado: "${text}"`);
			setTimeout(() => {
				btnEl.classList.remove("copied");
				btnEl.innerHTML = original;
			}, 1800);
		}
	}

	function escapeHtml(str) {
		if (!str) return "";
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function renderTable() {
		if (!tbodyEl) return;

		const query = searchQuery.trim().toLowerCase();
		const filtered = commandEntries.filter((item) => {
			const matchCat =
				currentCategory === "all" || item.category.toLowerCase() === currentCategory.toLowerCase();
			const matchQuery =
				query === "" ||
				item.main.toLowerCase().includes(query) ||
				item.description.toLowerCase().includes(query) ||
				item.example.toLowerCase().includes(query) ||
				item.aliases.some((a) => a.toLowerCase().includes(query));
			return matchCat && matchQuery;
		});

		if (filtered.length === 0) {
			tbodyEl.innerHTML = `
				<tr>
					<td colspan="4" style="text-align: center; padding: 32px; color: #64748b;">
						No se encontraron comandos que coincidan con "${escapeHtml(searchQuery)}".
					</td>
				</tr>
			`;
			return;
		}

		tbodyEl.innerHTML = filtered
			.map((item) => {
				const aliasesHtml = item.aliases
					.map((a) => `<span class="alias-pill">${escapeHtml(a)}</span>`)
					.join("");

				return `
				<tr>
					<td>
						<div class="cmd-main-cell">
							<code class="command-code">${escapeHtml(item.main)}</code>
							<button class="copy-btn" data-copy="${escapeHtml(item.example)}" title="Copiar ejemplo">
								Copiar
							</button>
						</div>
					</td>
					<td>
						<div class="alias-list">${aliasesHtml}</div>
					</td>
					<td>
						<code class="example-code">${escapeHtml(item.example)}</code>
					</td>
					<td>${escapeHtml(item.description)}</td>
				</tr>
			`;
			})
			.join("");

		tbodyEl.querySelectorAll(".copy-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				copyToClipboard(btn.getAttribute("data-copy"), btn);
			});
		});
	}

	if (categoryFiltersEl) {
		categoryFiltersEl.querySelectorAll(".filter-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				categoryFiltersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
				currentCategory = btn.getAttribute("data-category");
				renderTable();
			});
		});
	}

	if (searchInputEl) {
		searchInputEl.addEventListener("input", (e) => {
			searchQuery = e.target.value;
			renderTable();
		});
	}

	renderTable();
})();
