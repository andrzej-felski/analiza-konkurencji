const firmyKonkurencyjne = [...new Set(daneOfert.filter(o =>
	!["Chopin", "Pelmar", "Multimedia 2", "Multimedia 1 Stargard", "Multimedia 1 Olsztyn", "Multimedia 1 Ostróda", "Multimedia 1 Łowicz", "Multimedia 1 Kwidzyn"].includes(o.firma))
	.map(o => o.firma)
)];

const firmaSelect = document.getElementById('firmaSelect');
const uslugaSelect = document.getElementById('uslugaSelect');
const ofertaWartoscSelect = document.getElementById('ofertaWartoscSelect');
const umowaSelect = document.getElementById('umowaSelect');
const pokazOfertyBtn = document.getElementById('pokazOfertyKonkurencji');
const tabelaOfertDiv = document.getElementById('tabelaOfertKonkurencji');

uslugaSelect.disabled = true;
ofertaWartoscSelect.disabled = true;
umowaSelect.disabled = true;
pokazOfertyBtn.disabled = true;

// Wypełnij listę firm
firmyKonkurencyjne.forEach(firma => {
	const opt = document.createElement('option');
	opt.value = firma;
	opt.textContent = firma;
	firmaSelect.appendChild(opt);
});

// Po zmianie firmy
firmaSelect.addEventListener('change', () => {
	const firma = firmaSelect.value;
	uslugaSelect.innerHTML = '<option value="">-- Wybierz usługę --</option>';
	ofertaWartoscSelect.innerHTML = '<option value="">Wszystkie oferty</option>';
	umowaSelect.innerHTML = '<option value="">Wszystkie umowy</option>';
	tabelaOfertDiv.innerHTML = '';
	uslugaSelect.disabled = true;
	ofertaWartoscSelect.disabled = true;
	umowaSelect.disabled = true;
	pokazOfertyBtn.disabled = true;

	if (firma) {
		const uslugi = [...new Set(daneOfert
			.filter(o => o.firma === firma)
			.map(o => o.usluga)
		)];

		uslugi.forEach(usluga => {
			const opt = document.createElement('option');
			opt.value = usluga;
			opt.textContent = usluga;
			uslugaSelect.appendChild(opt);
		});

		if (uslugi.length > 0) {
			uslugaSelect.disabled = false;
		}
	}
});

// Po zmianie usługi
uslugaSelect.addEventListener('change', () => {
	const firma = firmaSelect.value;
	const usluga = uslugaSelect.value;

	ofertaWartoscSelect.innerHTML = '<option value="">Wszystkie oferty</option>';
	umowaSelect.innerHTML = '<option value="">Wszystkie umowy</option>';
	tabelaOfertDiv.innerHTML = '';
	ofertaWartoscSelect.disabled = true;
	umowaSelect.disabled = true;
	pokazOfertyBtn.disabled = true;

	if (firma && usluga) {
		const ofertyFiltrowane = daneOfert.filter(o => o.firma === firma && o.usluga === usluga);

		// Wartości ofert
		const wartosci = [...new Set(ofertyFiltrowane.map(o => o.ofertaWartosc))].sort((a, b) => a - b);

		const jednostkiOpis = {
			"Internet światłowodowy": "Mb/s",
			"Internet mobilny": "GB",
			"Telewizja": "kanałów",
			"Abonament komórkowy": "GB",
			"Telefon stacjonarny": "minut",
			"Internet i Telewizja": "Mb/s + TV",
			"Telewizja internetowa": "kanałów"
		};

		const jednostka = jednostkiOpis[usluga] || '';

		wartosci.forEach(w => {
			const opt = document.createElement('option');

			let jednostkaFinalna = jednostka;
			let wyswietlanaWartosc = w;

			if (usluga === "Telefon stacjonarny" && w === 9999) {
				wyswietlanaWartosc = "bez limitu";
				jednostkaFinalna = "";
			} else if ((usluga === "Internet światłowodowy" || usluga === "Internet i Telewizja") && w >= 1000) {
				wyswietlanaWartosc = (w / 1000).toFixed(1).replace('.0', '');
				jednostkaFinalna = usluga === "Internet światłowodowy" ? "Gb/s" : "Gb/s + TV";
			}

			opt.value = w;
			opt.textContent = `${wyswietlanaWartosc} ${jednostkaFinalna}`.trim();
			ofertaWartoscSelect.appendChild(opt);
		});


		if (wartosci.length > 0) {
			ofertaWartoscSelect.disabled = false;
		}

		// Umowy
		const umowy = [...new Set(ofertyFiltrowane.map(o => o.umowa))];
		umowy.forEach(u => {
			const opt = document.createElement('option');
			opt.value = u;
			opt.textContent = u;
			umowaSelect.appendChild(opt);
		});
		if (umowy.length > 0) {
			umowaSelect.disabled = false;
		}

		pokazOfertyBtn.disabled = false;
	}
});

ofertaWartoscSelect.addEventListener('change', () => {
	tabelaOfertDiv.innerHTML = '';
});

umowaSelect.addEventListener('change', () => {
	tabelaOfertDiv.innerHTML = '';
});

// Po kliknięciu przycisku
pokazOfertyBtn.addEventListener('click', () => {
	const firma = firmaSelect.value;
	const usluga = uslugaSelect.value;
	const ofertaWartoscRaw = ofertaWartoscSelect.value;
	const umowa = umowaSelect.value;
	const ofertaWartosc = ofertaWartoscRaw ? parseInt(ofertaWartoscRaw) : null;

	tabelaOfertDiv.innerHTML = '';

	if (!firma || !usluga) return;

	const oferty = daneOfert.filter(o =>
		o.firma === firma &&
		o.usluga === usluga &&
		(ofertaWartosc === null || o.ofertaWartosc === ofertaWartosc) &&
		(!umowa || o.umowa === umowa)
	);

	if (oferty.length === 0) {
		tabelaOfertDiv.innerHTML = `<p style="color:red;">Brak ofert tej firmy dla wybranych kryteriów.</p>`;
		return;
	}

	let tabela = `<table>
		<thead>
			<tr>
				<th>Firma</th>
				<th>Usługa</th>
				<th>Oferta</th>
				<th>Umowa</th>
				<th>Cena (zł)</th>
				<th>Promocja</th>
			</tr>
		</thead>
	<tbody>`;

	oferty.forEach(o => {
		const opisPromocji = o.promocja
			? `${o.promocja.cena.toFixed(2)} zł przez ${o.promocja.liczbaMiesiecy} mies.`
			: '-';

		tabela += `<tr>
			<td>${o.firma}</td>
			<td>${o.usluga}</td>
			<td>${o.oferta}</td>
			<td>${o.umowa}</td>
			<td>${o.cena.toFixed(2)}</td>
			<td>${opisPromocji}</td>
		</tr>`;
	});

	tabela += '</tbody></table>';
	tabelaOfertDiv.innerHTML = tabela;
});