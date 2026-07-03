// Porównywarka //
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

	const firmyWlasneLista = ["Chopin", "Pelmar", "Multimedia 2", "Multimedia 1 Stargard", "Multimedia 1 Olsztyn", "Multimedia 1 Ostróda", "Multimedia 1 Łowicz", "Multimedia 1 Kwidzyn", "Jim-Sat", "ELTRONIK"];

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
		"Chopin": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "plastCOM", "Tygrys.net", "LIMES", "HiSpeed", "Wave", "Starlink", "(hurtowe) Światłowód Inwestycje", "(hurtowe) Polski Światłowód Otwarty"],
		"Pelmar": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "INEA", "RFC", "JMDI", "GECKONET", "TELKAB", "Starlink", "(hurtowe) Światłowód Inwestycje", "(hurtowe) Polski Światłowód Otwarty"],
		"Multimedia 2": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "JMDI", "JPK", "Volta", "Abaks", "VLMedia", "mBit", "Pro Internet", "Starlink", "(hurtowe) Światłowód Inwestycje", "(hurtowe) Polski Światłowód Otwarty"],
		"Multimedia 1 Stargard": ["Orange", "T-Mobile", "Play", "Plus", "Vectra", "INEA", "RFC", "JMDI", "Loonar", "TRIPLEMEDIA", "Sinusnet", "Starlink", "(hurtowe) Światłowód Inwestycje"],
		"Multimedia 1 Olsztyn": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "Tsunami", "MATCOM", "Intelly", "IVENDO", "Starlink", "(hurtowe) Światłowód Inwestycje", "(hurtowe) NEXERA", "(hurtowe) Polski Światłowód Otwarty"],
		"Multimedia 1 Ostróda": ["Orange", "T-Mobile", "Play", "Plus", "Vectra", "INEA", "RFC", "MATCOM", "ELTRONIK", "IWKD", "Starlink", "(hurtowe) Światłowód Inwestycje", "(hurtowe) NEXERA", "(hurtowe) Polski Światłowód Otwarty"],
		"Multimedia 1 Łowicz": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "JMDI", "budimpex", "mpcnet", "timplus", "Starlink", "(hurtowe) Światłowód Inwestycje", "(hurtowe) NEXERA"],
		"Multimedia 1 Kwidzyn": ["Orange", "T-Mobile", "Play", "Plus", "Netia", "Vectra", "INEA", "RFC", "JMDI", "GECKONET", "nortis", "Starlink", "(hurtowe) Światłowód Inwestycje"],
		"Jim-Sat": ["Orange", "T-Mobile", "Play", "Provector", "Gorzowska Telewizja Przewodowa"],
		"ELTRONIK": ["Orange", "T-Mobile", "Play", "Vectra", "Netia"],
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
			case "Internet radiowy": tolerancjaUsługa = 50; break;
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

		const opisPromocji = (twojaOferta.promocje && twojaOferta.promocje.length > 0)
			? twojaOferta.promocje
				.map(p => `${p.cena.toFixed(2)} zł przez ${p.liczbaMiesiecy} mies.`)
				.join('<br>')
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

			const opisPromocji = (k.promocje && k.promocje.length > 0)
				? k.promocje
					.map(p => `${p.cena.toFixed(2)} zł przez ${p.liczbaMiesiecy} mies.`)
					.join('<br>')
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
//

// Nasze oferty //
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
			const opisPromocji = (o.promocje && o.promocje.length > 0)
				? o.promocje
					.map(p => `${p.cena.toFixed(2)} zł przez ${p.liczbaMiesiecy} mies.`)
					.join('<br>')
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
//

// Oferty konkurencji //
	const firmyKonkurencyjne = [...new Set(daneOfert.filter(o =>
		!["Chopin", "Pelmar", "Multimedia 2", "Multimedia 1 Stargard", "Multimedia 1 Olsztyn", "Multimedia 1 Ostróda", "Multimedia 1 Łowicz", "Multimedia 1 Kwidzyn", "Jim-Sat", "ELTRONIK"].includes(o.firma))
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
			const opisPromocji = (o.promocje && o.promocje.length > 0)
				? o.promocje
					.map(p => `${p.cena.toFixed(2)} zł przez ${p.liczbaMiesiecy} mies.`)
					.join('<br>')
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
//
