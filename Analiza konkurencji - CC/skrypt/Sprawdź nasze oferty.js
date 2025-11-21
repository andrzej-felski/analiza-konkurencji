const ofertaWartoscSelectWlasne = document.getElementById('ofertaWartoscSelectWlasne');
const umowaSelectWlasne = document.getElementById('umowaSelectWlasne');
const pokazOfertyBtnWlasne = document.getElementById('pokazOfertyWlasne');
const tabelaOfertDivWlasne = document.getElementById('tabelaOfertWlasne');

// Wypełnianie selecta firm
firmyWlasne.forEach(firma => {
	const opt = document.createElement('option');
	opt.value = firma;
	opt.textContent = firma;
	firmaSelectWlasne.appendChild(opt);
});		

// Po wybraniu firmy – wybór usługi
firmaSelectWlasne.addEventListener('change', () => {
	const firma = firmaSelectWlasne.value;
	uslugaSelectWlasne.innerHTML = '<option value="">-- Wybierz usługę --</option>';
	ofertaWartoscSelectWlasne.innerHTML = '<option value="">Wszystkie oferty</option>';
	umowaSelectWlasne.innerHTML = '<option value="">Wszystkie umowy</option>';
	tabelaOfertDivWlasne.innerHTML = '';

	uslugaSelectWlasne.disabled = true;
	ofertaWartoscSelectWlasne.disabled = true;
	umowaSelectWlasne.disabled = true;
	pokazOfertyBtnWlasne.disabled = true;

	if (firma) {
		const uslugi = [...new Set(daneOfert
			.filter(o => o.firma === firma)
			.map(o => o.usluga)
		)];

		uslugi.forEach(usluga => {
			const opt = document.createElement('option');
			opt.value = usluga;
			opt.textContent = usluga;
			uslugaSelectWlasne.appendChild(opt);
		});
	
		if (uslugi.length > 0) {
			uslugaSelectWlasne.disabled = false;
		}
	}
});

// Po wybraniu usługi – wybór wartości oferty + umowy
uslugaSelectWlasne.addEventListener('change', () => {
	const firma = firmaSelectWlasne.value;
	const usluga = uslugaSelectWlasne.value;

	ofertaWartoscSelectWlasne.innerHTML = '<option value="">Wszystkie oferty</option>';
	umowaSelectWlasne.innerHTML = '<option value="">Wszystkie umowy</option>';
	tabelaOfertDivWlasne.innerHTML = '';
	ofertaWartoscSelectWlasne.disabled = true;
	umowaSelectWlasne.disabled = true;

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
			ofertaWartoscSelectWlasne.appendChild(opt);
		});


		if (wartosci.length > 0) {
			ofertaWartoscSelectWlasne.disabled = false;
		}

		// Długości umowy
		const umowy = [...new Set(ofertyFiltrowane.map(o => o.umowa))];
			umowy.forEach(u => {
				const opt = document.createElement('option');
				opt.value = u;
				opt.textContent = u;
				umowaSelectWlasne.appendChild(opt);
			});
			if (umowy.length > 0) {
				umowaSelectWlasne.disabled = false;
			}
		
			pokazOfertyBtnWlasne.disabled = false;
		}
	});

	// Wyczyść tabelę po zmianach
	ofertaWartoscSelectWlasne.addEventListener('change', () => {
		tabelaOfertDivWlasne.innerHTML = '';
	});

	umowaSelectWlasne.addEventListener('change', () => {
		tabelaOfertDivWlasne.innerHTML = '';
});

// Kliknięcie "Pokaż oferty"
pokazOfertyBtnWlasne.addEventListener('click', () => {
	const firma = firmaSelectWlasne.value;
	const usluga = uslugaSelectWlasne.value;
	const ofertaWartoscRaw = ofertaWartoscSelectWlasne.value;
	const umowa = umowaSelectWlasne.value;
	const ofertaWartosc = ofertaWartoscRaw ? parseInt(ofertaWartoscRaw) : null;

	tabelaOfertDivWlasne.innerHTML = '';

	if (!firma || !usluga) return;

	const oferty = daneOfert.filter(o =>
		o.firma === firma &&
		o.usluga === usluga &&
		(ofertaWartosc === null || o.ofertaWartosc === ofertaWartosc) &&
		(!umowa || o.umowa === umowa)
	);

	if (oferty.length === 0) {
		tabelaOfertDivWlasne.innerHTML = `<p style="color:red;">Brak ofert tej firmy dla wybranych kryteriów.</p>`;
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
	tabelaOfertDivWlasne.innerHTML = tabela;
});