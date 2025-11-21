// Elementy formularza
const selectFirma = document.getElementById('firma');
const selectUsluga = document.getElementById('usluga');
const selectOferta = document.getElementById('oferta');
const selectUmowa = document.getElementById('umowa');
const btnPokaz = document.getElementById('pokazBtn');
const btnSortuj = document.getElementById('sortujBtn');
const divWynik = document.getElementById('wynik');

// Zmienne pomocnicze
let aktualnaKonkurencja = [];
let twojaOfertaGlobal = null;

const firmyWlasneLista = ["Chopin", "Pelmar", "Multimedia 2", "Multimedia 1 Stargard", "Multimedia 1 Olsztyn", "Multimedia 1 Ostróda", "Multimedia 1 Łowicz", "Multimedia 1 Kwidzyn"];

// Wypełnij select "firma" na podstawie danych i firm własnych
const firmyWlasne = [...new Set(daneOfert
	.filter(o => firmyWlasneLista.includes(o.firma))
	.map(o => o.firma)
)];

firmyWlasne.forEach(firma => {
	const opt = document.createElement('option');
	opt.value = firma;
	opt.textContent = firma;
	selectFirma.appendChild(opt);
});

// Mapa firm i ich konkurencji
const mapaKonkurencji = {
	"Chopin": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "plastCOM", "Tygrys.net", "LIMES", "(hurtowe) Światłowód Inwestycje", "(hurtowe) Polski Światłowód Otwarty"],
	"Pelmar": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "INEA", "RFC", "JMDI", "GECKONET", "TELKAB", "(hurtowe) Światłowód Inwestycje", "(hurtowe) Polski Światłowód Otwarty"],
	"Multimedia 2": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "JMDI", "JPK", "eVolta", "Abaks", "(hurtowe) Światłowód Inwestycje", "(hurtowe) Polski Światłowód Otwarty"],
	"Multimedia 1 Stargard": ["Orange", "T-Mobile", "Play", "Plus", "Vectra", "INEA", "RFC", "JMDI", "Loonar", "TRIPLEMEDIA", "Sinusnet", "(hurtowe) Światłowód Inwestycje"],
	"Multimedia 1 Olsztyn": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "Tsunami", "MATCOM", "Intelly", "IVENDO", "(hurtowe) Światłowód Inwestycje", "(hurtowe) NEXERA", "(hurtowe) Polski Światłowód Otwarty"],
	"Multimedia 1 Ostróda": ["Orange", "T-Mobile", "Play", "Plus", "Vectra", "INEA", "RFC", "MATCOM", "ELTRONIK", "IWKD", "(hurtowe) Światłowód Inwestycje", "(hurtowe) NEXERA", "(hurtowe) Polski Światłowód Otwarty"],
	"Multimedia 1 Łowicz": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "JMDI", "itv media", "budimpex", "mpcnet", "timplus", "(hurtowe) Światłowód Inwestycje", "(hurtowe) NEXERA"],
	"Multimedia 1 Kwidzyn": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "JMDI", "GECKONET", "nortis", "(hurtowe) Światłowód Inwestycje"],
};

// Obsługa wyboru firmy
selectFirma.addEventListener('change', () => {
	selectUsluga.innerHTML = '<option value="">-- Wybierz usługę --</option>';
	selectOferta.innerHTML = '<option value="">-- Wybierz ofertę --</option>';
	selectUmowa.innerHTML = '<option value="">-- Wybierz umowę --</option>';
	selectUsluga.disabled = true;
	selectOferta.disabled = true;
	selectUmowa.disabled = true;
	btnPokaz.disabled = true;
	btnSortuj.disabled = true;
	btnSortuj.style.display = 'none';
	divWynik.innerHTML = '';

	const firma = selectFirma.value;
	if (firma) {
		const uslugi = [...new Set(daneOfert.filter(o => o.firma === firma).map(o => o.usluga))];
		uslugi.forEach(u => {
			const opt = document.createElement('option');
			opt.value = u;
			opt.textContent = u;
			selectUsluga.appendChild(opt);
		});
		selectUsluga.disabled = false;
  	}
});

selectUsluga.addEventListener('change', () => {
	const usluga = selectUsluga.value;
	const firma = selectFirma.value;
	selectOferta.innerHTML = '<option value="">-- Wybierz ofertę --</option>';
	selectUmowa.innerHTML = '<option value="">-- Wybierz umowę --</option>';
	selectOferta.disabled = true;
	selectUmowa.disabled = true;
	btnPokaz.disabled = true;
	btnSortuj.disabled = true;
	btnSortuj.style.display = 'none';
	divWynik.innerHTML = '';

	if (usluga) {
		const oferty = [...new Set(daneOfert
			.filter(o => o.firma === firma && o.usluga === usluga)
			.map(o => o.oferta)
		)];
		oferty.forEach(o => {
			const opt = document.createElement('option');
			opt.value = o;
			opt.textContent = o;
			selectOferta.appendChild(opt);
		});
		selectOferta.disabled = false;
	}
});

selectOferta.addEventListener('change', () => {
	const usluga = selectUsluga.value;
	const oferta = selectOferta.value;
	const firma = selectFirma.value;
	selectUmowa.innerHTML = '<option value="">-- Wybierz umowę --</option>';
	selectUmowa.disabled = true;
	btnPokaz.disabled = true;
	btnSortuj.disabled = true;
	btnSortuj.style.display = 'none';
	divWynik.innerHTML = '';

	if (oferta) {
		const umowy = [...new Set(daneOfert
			.filter(o => o.firma === firma && o.usluga === usluga && o.oferta === oferta)
			.map(o => o.umowa)
		)];
		umowy.forEach(u => {
			const opt = document.createElement('option');
			opt.value = u;
			opt.textContent = u;
			selectUmowa.appendChild(opt);
		});
		selectUmowa.disabled = false;	
	}
});

selectUmowa.addEventListener('change', () => {
	btnPokaz.disabled = !selectUmowa.value;
	btnSortuj.disabled = true;
	btnSortuj.style.display = 'none';
	divWynik.innerHTML = '';
});

// Pokazuj wyniki
btnPokaz.addEventListener('click', () => {
	const firma = selectFirma.value;
	const usluga = selectUsluga.value;
	const oferta = selectOferta.value;
	const umowa = selectUmowa.value;

	if (!firma || !usluga || !oferta || !umowa) return;

	const twojaOferta = daneOfert.find(o =>
		o.firma === firma &&
		o.usluga === usluga &&
		o.oferta === oferta &&
		o.umowa === umowa
	);

	if (!twojaOferta) {
		divWynik.innerHTML = `<p style="color:red;">Brak oferty Twojej firmy dla wybranych parametrów.</p>`;
		return;
	}

	// Tolerancje
	let tolerancjaUsługa;
	switch (usluga) {
		case "Internet światłowodowy": tolerancjaUsługa = 200; break;
		case "Internet mobilny": tolerancjaUsługa = 50; break;
		case "Telewizja": tolerancjaUsługa = 20; break;
		case "Abonament komórkowy": tolerancjaUsługa = 20; break;
		case "Telefon komórkowy": tolerancjaUsługa = 100; break;
		case "Internet i Telewizja": tolerancjaUsługa = 200; break;
		case "Telewizja internetowa": tolerancjaUsługa = 30; break;
		default: tolerancjaUsługa = 100;
	}

	const tolerancjaUmowa = 6;

	// Lista firm konkurencyjnych dla wybranej firmy
	const firmyKonkurencyjne = mapaKonkurencji[firma] || [];

	let konkurencja;

	if (typeof twojaOferta.ofertaWartosc === 'number') {
		konkurencja = daneOfert.filter(o =>
			firmyKonkurencyjne.includes(o.firma) &&
			o.usluga === usluga &&
			typeof o.umowaWartosc === "number" &&
			Math.abs(o.umowaWartosc - twojaOferta.umowaWartosc) <= tolerancjaUmowa && 
			typeof o.ofertaWartosc === 'number' &&
			Math.abs(o.ofertaWartosc - twojaOferta.ofertaWartosc) <= tolerancjaUsługa
		);
	} else {
		konkurencja = daneOfert.filter(o =>
			firmyKonkurencyjne.includes(o.firma) &&
			o.usluga === usluga &&
			o.umowa === umowa
		);
	}

	// Zapamiętaj dane do sortowania
	aktualnaKonkurencja = konkurencja.slice();
	twojaOfertaGlobal = twojaOferta;
	btnSortuj.disabled = false;
	btnSortuj.style.display = 'inline-block';

	zbudujTabele(twojaOferta, konkurencja);
});

// Sortowanie
btnSortuj.addEventListener('click', () => {
	if (!twojaOfertaGlobal || !aktualnaKonkurencja.length) return;

	const posortowana = [...aktualnaKonkurencja].sort((a, b) => a.cena - b.cena);
	zbudujTabele(twojaOfertaGlobal, posortowana);
});

// Buduj tabelę
function zbudujTabele(twojaOferta, konkurencjaPosortowana) {
	let tabela = `<table>
		<thead>
			<tr>
				<th>Firma</th>
				<th>Usługa</th>
				<th>Oferta</th>
				<th>Umowa</th>
				<th>Cena (zł)</th>
				<th>Porównanie ceny</th>
				<th>Promocja</th>
			</tr>
		</thead>
	<tbody>`;

	const opisPromocji = twojaOferta.promocja
		? `${twojaOferta.promocja.cena} zł przez ${twojaOferta.promocja.liczbaMiesiecy} mies.`
		 : '-';

	tabela += `<tr class="moja-firma">
		<td>${twojaOferta.firma}</td>
		<td>${twojaOferta.usluga}</td>
		<td>${twojaOferta.oferta}</td>
		<td>${twojaOferta.umowa}</td>
		<td>${twojaOferta.cena.toFixed(2)}</td>
		<td>-</td>
		<td>${opisPromocji}</td>
	</tr>`;

	konkurencjaPosortowana.forEach(k => {
		const roznica = k.cena - twojaOferta.cena;
		let tekst = '';

		 if (roznica > 0) {
			tekst = `drożej o ${roznica.toFixed(2)} zł`;
		} else if (roznica < 0) {
			tekst = `taniej o ${Math.abs(roznica).toFixed(2)} zł`;
		} else {
			tekst = 'taka sama cena';
		}

		const opisPromocji = k.promocja
			? `${k.promocja.cena.toFixed(2)} zł przez ${k.promocja.liczbaMiesiecy} mies.`
			: '-';

		tabela += `<tr>
			<td>${k.firma}</td>
			<td>${k.usluga}</td>
			<td>${k.oferta}</td>
			<td>${k.umowa}</td>
			<td>${k.cena.toFixed(2)}</td>
			<td style="font-weight:bold;">${tekst}</td>
			<td>${opisPromocji}</td>
  		</tr>`;
	});

	tabela += '</tbody></table>';
	divWynik.innerHTML = tabela;
}