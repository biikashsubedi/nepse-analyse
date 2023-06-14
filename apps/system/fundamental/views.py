from django.contrib import messages
from django.db.models import Q
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView
from .models import FinancialData
from fundamental import *
from ..config.models import Config
from config import *
from ..data.models import Exchange
import json
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager


class DataIndexView(ListView):
    model = FinancialData
    paginate_by = 50
    template_name = "backend/financial/index.html"


class DataCollectIndexView(ListView):
    model = Exchange
    paginate_by = 50
    template_name = "backend/financial/collect.html"

    def get_queryset(self):
        queryset = super().get_queryset()
        keyword = self.request.GET.get('keyword')

        if keyword:
            queryset = queryset.filter(Q(title__icontains=keyword) | Q(title__icontains=keyword.lower()))
        return queryset


class DataProcessView(ListView):
    model = FinancialData
    title = FUNDAMENTAL
    success_message = "Exchange Data Synced Successfully."
    error_message = "Failed to sync exchange data from the API."
    error_message_only = "This exchange is not supported for now."
    success_url = reverse_lazy('fundamental:collect')

    def get(self, request, *args, **kwargs):
        exchangeId = self.kwargs['pk']
        exchange = Exchange.objects.filter(id=exchangeId).first()
        for supportedExchange in SUPPORTED_EXCHANGE:
            if supportedExchange in exchange.title:
                configUrl = Config.objects.filter(title=self.title).first()
                if configUrl.value:
                    symbols = exchange.symbol_set.all()
                    for symbol in symbols:
                        checkIfAlreadyDataProceed = FinancialData.objects.filter(symbol=symbol).first()
                        if checkIfAlreadyDataProceed:
                            continue

                        url = configUrl.value + symbol.symbol
                        chrome_options = Options()
                        chrome_options.add_experimental_option('detach', True)
                        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),
                                                  options=chrome_options)

                        driver.get(url)
                        driver.maximize_window()
                        buttons = driver.find_elements("xpath", "//div[contains(@id, 'finanace-menu')]/a")
                        driver.execute_script("arguments[0].click();", buttons[0])

                        sleepTime = 5
                        for i in range(sleepTime, 0, -1):
                            if i == sleepTime:
                                print("This is waiting countdown")
                            print(f"Wait for {i} second.")
                            time.sleep(1)

                        html_content = driver.page_source

                        driver.quit()
                        soup = BeautifulSoup(html_content, 'html.parser')
                        my_qtr_report_div = soup.find('div', class_='myQtrReport')

                        dataIds = ['balance', 'profitloss', 'keyratios']
                        dataDict = {}
                        for id in dataIds:
                            balance_div = my_qtr_report_div.find('div', id=id)
                            trData = balance_div.find('table').find_all('tr')

                            for tr in trData:
                                td_list = tr.find_all('td')
                                if td_list:
                                    key = td_list[0].text.strip()
                                    value = td_list[1].text.strip()
                                    dataDict.update({key.replace(' ', '_').lower(): value})

                        operatingIncome = 0
                        operatingExpenses = 0
                        data = {}
                        data.update({'symbol_id': symbol.id, 'quarter': 3, 'year': '2079/2080'})
                        for key, value in dataDict.items():
                            if key in HYDROPOWER:
                                if key == "operating_income":
                                    operatingIncome = int(value.replace(',', '').replace('.', ''))
                                if key == "operating_expenses":
                                    operatingExpenses = int(value.replace(',', '').replace('.', ''))

                                if operatingExpenses > 0 and operatingIncome > 0:
                                    data.update({'operating_margin': operatingIncome - operatingExpenses})
                                    operatingIncome = 0
                                    operatingExpenses = 0
                                else:
                                    data.update({HYDROPOWER[key]: value})
                        FinancialData.objects.create(**data)

            else:
                messages.error(self.request, self.error_message_only)

        return redirect(self.success_url)
