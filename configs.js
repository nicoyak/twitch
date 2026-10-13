const configs = (function () {
	"use strict";

	// ============================================================================
	// 1. LISTA PÚBLICA DE RECOMPENSAS (Catálogo Web GitHub Pages)
	// ============================================================================
	const rewards = {
		pomo: {
			id: "pomo",
			name: "Agregar Pomodoro Extra (+25 min)",
			cost: 450,
			category: "Estudio",
			description: "El streamer añade un bloque pomodoro más (+25 min) a la sesión actual de estudio.",
			icon: "images/rewards/pomo.svg",
			command: "!canjear pomo",
		},
		break: {
			id: "break",
			name: "Extender el Break (+5 min)",
			cost: 240,
			category: "Estudio",
			description: "Alarga 5 minutos el próximo descanso para charlar, estirar o tomar café.",
			icon: "images/rewards/break.svg",
			command: "!canjear break",
		},
		musica: {
			id: "musica",
			name: "Elegir Música del Bloque",
			cost: 250,
			category: "Ambiente",
			description: "Elegí la playlist o canción lofi/focus para el siguiente bloque de estudio.",
			icon: "images/rewards/musica.svg",
			command: "!canjear musica",
		},
		vip: {
			id: "vip",
			name: "VIP por un Mes",
			cost: 3000,
			category: "VIP",
			description: "¡Obtén la codiciada insignia de VIP en el chat de Twitch durante 30 días!",
			icon: "images/rewards/vip.svg",
			command: "!canjear vip",
		},
		sub: {
			id: "sub",
			name: "Suscripción gratis (Tier 1)",
			cost: 6000,
			category: "VIP",
			description: "Recompensa mayor: ¡Gánate una suscripción al canal por tu esfuerzo!",
			icon: "images/rewards/sub.svg",
			command: "!canjear sub",
		},
		donar: {
			id: "donar",
			name: "Donar ✅Checks a Compañero",
			cost: 0,
			category: "Especiales",
			description: "Transfiere ✅Checks de tu saldo a otro compañero con !donar @usuario <checks>.",
			icon: "images/rewards/donar.svg",
			command: "!donar @usuario 50",
		},
		robinhood: {
			id: "robinhood",
			name: "Motín de Robin Hood",
			cost: 100,
			category: "Especiales",
			description: "Inicia el evento: los ✅Checks de Nico Yak se reparten entre todos los que escriban !unirse o !robar.",
			icon: "images/rewards/robinhood.svg",
			command: "!canjear robinhood",
		},
	};

	// ============================================================================
	// 2. COMANDOS PÚBLICOS DEL CHAT (Guía Web)
	// ============================================================================
	const commands = {
		addTaskCommands: ["!task", "!add", "!todo", "!tarea", "!taska", "!taskadd", "!addtask", "!atask"],
		focusTaskCommands: ["!focus", "!cambiartarea", "!tareaactual", "!focustask", "!enfocar", "!foco"],
		afkCommands: ["!afk", "!break", "!pausa", "!pause", "!descanso", "!brb"],
		deleteTaskCommands: ["!remove", "!delete", "!borrar", "!eliminar", "!taskd", "!taskdel", "!taskdelete", "!deltask", "!rtask", "!removetask"],
		editTaskCommands: ["!edit", "!rename", "!editar", "!cambiar", "!taskedit", "!edittask", "!taske", "!etask"],
		finishTaskCommands: ["!done", "!listo", "!completado", "!donetask", "!taskdone", "!terminado"],
		nextTaskCommands: ["!next", "!sig", "!siguiente", "!nexttask", "!taskn"],
		checkCommands: ["!mytask", "!check", "!mytasks", "!mitarea", "!mis-tareas", "!mistareas", "!taskc", "!taskcheck", "!ctask"],
		pointsCommands: ["!puntos", "!points", "!mispuntos", "!saldo", "!checkpoints", "!mis-puntos"],
		donateCommands: ["!donar", "!donate", "!regalar", "!transferir"],
		redeemCommands: ["!canjear", "!redeem", "!comprar", "!recompensa"],
		robinhoodCommands: ["!robinhood", "!robin"],
		joinRobinhoodCommands: ["!unirse", "!robar", "!join", "!motin"],
		tiendaCommands: ["!tienda", "!shop", "!catalogo", "!store", "!premios"],
		helpCommands: ["!taskhelp", "!tasks", "!ayuda", "!comandos", "!help", "!taskh", "!helptask"],
	};

	return {
		rewards,
		commands,
	};
})();
