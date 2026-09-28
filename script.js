const yearElement = document.querySelector("#current-year");
const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const typedText = document.querySelector("#typed-text");
const counterToggle = document.querySelector("#counter-toggle");
const experienceCounter = document.querySelector("#experience-counter");
const experienceCount = document.querySelector("#experience-count");

if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem("gabriel-theme");
if (savedTheme === "dark") {
	document.documentElement.dataset.theme = "dark";
}

function updateThemeButton() {
	const isDark = document.documentElement.dataset.theme === "dark";
	themeToggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
	themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
}

if (themeToggle) {
	updateThemeButton();
	themeToggle.addEventListener("click", () => {
		const isDark = document.documentElement.dataset.theme !== "dark";
		document.documentElement.dataset.theme = isDark ? "dark" : "light";
		if (!isDark) document.documentElement.removeAttribute("data-theme");
		localStorage.setItem("gabriel-theme", isDark ? "dark" : "light");
		updateThemeButton();
	});
}

if (menuToggle && navLinks) {
	menuToggle.addEventListener("click", () => {
		const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
		menuToggle.setAttribute("aria-expanded", String(isOpen));
		menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
		navLinks.classList.toggle("is-open", isOpen);
	});

	navLinks.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			menuToggle.setAttribute("aria-expanded", "false");
			menuToggle.setAttribute("aria-label", "Abrir menu");
			navLinks.classList.remove("is-open");
		});
	});
}

if (typedText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	const phrase = typedText.textContent;
	typedText.textContent = "";
	let letterIndex = 0;
	const typeNextLetter = () => {
		if (letterIndex < phrase.length) {
			typedText.textContent += phrase.charAt(letterIndex);
			letterIndex += 1;
			window.setTimeout(typeNextLetter, 38);
		}
	};
	window.setTimeout(typeNextLetter, 300);
}

if (counterToggle && experienceCounter && experienceCount) {
	counterToggle.addEventListener("click", () => {
		const isOpen = counterToggle.getAttribute("aria-expanded") !== "true";
		counterToggle.setAttribute("aria-expanded", String(isOpen));
		experienceCounter.hidden = !isOpen;

		if (isOpen) {
			const total = document.querySelectorAll(".experience-card").length;
			const start = performance.now();
			const countUp = (now) => {
				const progress = Math.min((now - start) / 500, 1);
				experienceCount.textContent = String(Math.round(total * progress));
				if (progress < 1 && counterToggle.getAttribute("aria-expanded") === "true") {
					requestAnimationFrame(countUp);
				}
			};
			requestAnimationFrame(countUp);
		}
	});
}

const particleCanvas = document.querySelector("#particle-canvas");
const canvasContext = particleCanvas?.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (particleCanvas && canvasContext && !reducedMotion) {
	let particles = [];
	let animationFrame;
	const particleCount = Math.min(55, Math.floor(window.innerWidth / 24));

	function resizeCanvas() {
		const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		particleCanvas.width = window.innerWidth * pixelRatio;
		particleCanvas.height = window.innerHeight * pixelRatio;
		canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		particles = Array.from({ length: particleCount }, () => ({
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			radius: Math.random() * 1.6 + 0.5,
			speed: Math.random() * 0.22 + 0.06
		}));
	}

	function drawParticles() {
		canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
		const isDark = document.documentElement.dataset.theme === "dark";
		canvasContext.fillStyle = isDark ? "rgba(220, 174, 56, 0.28)" : "rgba(201, 133, 45, 0.22)";
		particles.forEach((particle) => {
			particle.y -= particle.speed;
			if (particle.y < -4) particle.y = window.innerHeight + 4;
			canvasContext.beginPath();
			canvasContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			canvasContext.fill();
		});
		animationFrame = requestAnimationFrame(drawParticles);
	}

	resizeCanvas();
	drawParticles();
	window.addEventListener("resize", () => {
		cancelAnimationFrame(animationFrame);
		resizeCanvas();
		drawParticles();
	});
}
