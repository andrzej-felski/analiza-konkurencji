fetch("https://api.github.com/repos/andrzej-felski/analiza-konkurencji/commits?per_page=1")
	.then(response => response.json())
	.then(commits => {
		const date = new Date(commits[0].commit.committer.date);

		const formatted = date.toLocaleDateString("pl-PL", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		});

		document.getElementById("last-update").textContent = formatted + " r.";
	})
	.catch(err => {
		console.error(err);
		document.getElementById("last-update").textContent = "brak danych";
	});