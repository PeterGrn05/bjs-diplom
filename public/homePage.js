const logoutButton = new LogoutButton();

logoutButton.action = function () {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        } 
    });
}

ApiConnector.current(response => {
    console.log("response:", response);
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

function updateRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data)
        }
    })
}

updateRates();
setInterval(updateRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Успешно пополнен баланс");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    })
}

moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Успешно переведены деньги");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    })
}

moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Успешно отправлены деньги");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    })
}


const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	};
});



favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, (response) => {
		if (response.success) {
            favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(true, 'Добавление прошло успешно!')
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	})
}

favoritesWidget.removeUserCallback = (data) => {
	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
            favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, 'Удалние прошло успешно!')
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		};
	});
}