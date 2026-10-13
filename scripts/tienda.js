/**
 * Chat Task Overlay Multi - Web Catalog Script
 * Handles rewards rendering, search filtering, category tabs,
 * and 1-click clipboard command copying with tactile feedback.
 */

(function () {
	"use strict";

	const gridEl = document.getElementById("rewards-grid");
	const emptyStateEl = document.getElementById("empty-state");
	const searchInputEl = document.getElementById("search-input");
	const categoryFiltersEl = document.getElementById("category-filters");
	const toastEl = document.getElementById("toast");
	const toastTextEl = document.getElementById("toast-text");

	const rewards = Object.values(configs.rewards || {});
	let currentCategory = "all";
	let searchQuery = "";
	let toastTimeout = null;

	/**
	 * Shows a brief toast message
	 */
	function showToast(message) {
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTextEl.innerText = message;
		toastEl.classList.add("show");
		toastTimeout = setTimeout(() => {
			toastEl.classList.remove("show");
		}, 2500);
	}

	/**
	 * Copies text to clipboard safely
	 */
	async function copyToClipboard(text, btnEl) {
		let success = false;
		if (navigator.clipboard && navigator.clipboard.writeText) {
			try {
				await navigator.clipboard.writeText(text);
				success = true;
			} catch (e) {
				// Fallback to execCommand if clipboard API was rejected or blocked
			}
		}

		if (!success) {
			try {
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.left = "-9999px";
				textArea.style.top = "-9999px";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				success = document.execCommand("copy");
				document.body.removeChild(textArea);
			} catch (err) {
				console.error("Failed to copy:", err);
			}
		}

		if (success) {
			const originalText = btnEl.innerHTML;
			btnEl.classList.add("copied");
			btnEl.innerHTML = `✓ Copiado`;
			showToast(`Comando copiado: "${text}"`);

			setTimeout(() => {
				btnEl.classList.remove("copied");
				btnEl.innerHTML = originalText;
			}, 2000);
		} else {
			showToast(`Comando: "${text}"`);
		}
	}

	/**
	 * Renders reward cards according to active filters
	 */
	function renderRewards() {
		const filtered = rewards.filter((r) => {
			const matchesCategory =
				currentCategory === "all" || r.category.toLowerCase() === currentCategory.toLowerCase();

			const query = searchQuery.trim().toLowerCase();
			const matchesQuery =
				query === "" ||
				r.name.toLowerCase().includes(query) ||
				r.description.toLowerCase().includes(query) ||
				r.command.toLowerCase().includes(query) ||
				r.category.toLowerCase().includes(query);

			return matchesCategory && matchesQuery;
		});

		if (filtered.length === 0) {
			gridEl.innerHTML = "";
			emptyStateEl.style.display = "flex";
			return;
		}

		emptyStateEl.style.display = "none";

		gridEl.innerHTML = filtered
			.map((reward) => {
				return `
				<div class="reward-card" data-category="${escapeHtml(reward.category)}">
					<div class="card-top-row">
						<div class="reward-icon-box">
							<img src="${escapeHtml(reward.icon)}" alt="${escapeHtml(reward.name)}" />
						</div>
						<span class="category-tag" data-cat="${escapeHtml(reward.category)}">${escapeHtml(reward.category)}</span>
					</div>
					<div class="card-content">
						<div class="card-title-row">
							<h2 class="card-title">${escapeHtml(reward.name)}</h2>
							<span class="card-cost">${reward.cost > 0 ? `${Number(reward.cost)} ✅Checks` : "Especial"}</span>
						</div>
						<p class="card-desc">${escapeHtml(reward.description)}</p>
					</div>
					<div class="card-footer">
						<code class="command-code">${escapeHtml(reward.command)}</code>
						<button class="copy-btn" data-copy="${escapeHtml(reward.command)}">
							<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
							Copiar
						</button>
					</div>
				</div>
			`;
			})
			.join("");

		// Attach copy button listeners
		gridEl.querySelectorAll(".copy-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const cmd = btn.getAttribute("data-copy");
				copyToClipboard(cmd, btn);
			});
		});
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

	// Filter Tabs Event Listeners
	categoryFiltersEl.querySelectorAll(".filter-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			categoryFiltersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			currentCategory = btn.getAttribute("data-category");
			renderRewards();
		});
	});

	// Search Input Listener
	searchInputEl.addEventListener("input", (e) => {
		searchQuery = e.target.value;
		renderRewards();
	});

	// Initial render
	renderRewards();
})();
