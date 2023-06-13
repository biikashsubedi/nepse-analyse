import datetime

from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import CreateView, ListView, UpdateView, DeleteView
from config import DATA, SYMBOL
from nepseAnalyse import settings
from .models import *
from django.urls import reverse_lazy
import requests
import csv
import os
from openpyxl import load_workbook
from django.shortcuts import render

from ..config.models import Config


class DataIndexView(ListView):
    model = Data
    paginate_by = 50
    template_name = "backend/data/index.html"


class CSVIndexView(ListView):
    model = Data
    template_name = "backend/csv/index.html"

    def get_context_data(self, **kwargs):
        excel_folder = settings.MEDIA_ROOT + '/excel'
        file_list = []
        for root, dirs, files in os.walk(excel_folder):
            for dir in dirs:
                for root2, dirs2, files2 in os.walk(excel_folder + '/' + dir):
                    for file_name in files2:
                        if file_name.endswith('.csv'):
                            symbol = file_name.replace('_data.csv', '')
                            file_path = os.path.join(root + '/' + symbol, file_name)
                            file_list.append({
                                'symbol': symbol.upper(),
                                'file_name': file_name,
                                'file_path': file_path,
                            })

        context = super().get_context_data(**kwargs)
        context['object_list'] = {}
        context['files'] = file_list
        return context


class SymbolIndexView(ListView):
    model = Symbol
    paginate_by = 30
    template_name = "backend/symbol/index.html"

    def get_queryset(self):
        queryset = super().get_queryset()
        keyword = self.request.GET.get('keyword')

        if keyword:
            queryset = queryset.filter(Q(title__icontains=keyword) | Q(title__icontains=keyword.lower()))
        return queryset


class SymbolDataProcessView(ListView):
    model = Symbol
    title = SYMBOL
    success_message = "Symbol Synced Successfully."
    error_message = "Failed to sync symbols from the API."
    success_url = reverse_lazy('nepse:symbol.index')

    def get(self, request, *args, **kwargs):
        url = Config.objects.filter(title=self.title).first()
        if url.value:
            response = requests.get(url.value)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    for item in data:
                        checkIfAlreadyExists = Symbol.objects.filter(symbol=item['symbol']).first()
                        if not checkIfAlreadyExists:
                            exchangeTitle = item['exchange'].replace('src:Nepsealpha.com', '')
                            exchange = Exchange.objects.filter(title=exchangeTitle).first()
                            if not exchange:
                                exchange = Exchange.objects.create(title=exchangeTitle)
                            Symbol.objects.create(
                                title=item['full_name'],
                                symbol=item['symbol'],
                                description=item['description'],
                                exchange=exchange,
                                type=item['type'],
                            )
                    messages.success(self.request, self.success_message)
                else:
                    messages.error(self.request, self.error_message)
            else:
                messages.error(self.request, self.error_message)
        else:
            messages.error(self.request, self.error_message)

        return redirect(self.success_url)


class DataProcessView(ListView):
    model = Data
    title = DATA
    success_message = "Nepse Data Synced Successfully."
    error_message = "Failed to sync nepse data from the API."
    success_url = reverse_lazy('nepse:data.index')

    def get(self, request, *args, **kwargs):

        url = Config.objects.filter(title=self.title).first()
        symbol = request.GET.get('symbol')
        checkSymbol = Symbol.objects.filter(symbol=symbol).first()
        if url.value and checkSymbol:
            reqUrl = url.value + symbol
            response = requests.get(reqUrl)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict):

                    zipped_values = zip(data['t'], data['c'], data['o'], data['h'], data['l'], data['v'])
                    items = []
                    for row in zipped_values:
                        items.append({
                            't': row[0],
                            'c': row[1],
                            'o': row[2],
                            'h': row[3],
                            'l': row[4],
                            'v': row[5],
                        })

                    for item in items:
                        checkIfAlreadyExists = Data.objects.filter(timestamp=item['t'], symbol=checkSymbol).first()
                        if not checkIfAlreadyExists:
                            dt = datetime.datetime.fromtimestamp(item['t'])
                            formatted_date = dt.strftime("%Y-%m-%d %H:%M:%S.%f")

                            Data.objects.create(
                                symbol=checkSymbol,
                                timestamp=item['t'],
                                closing=item['c'],
                                opening=item['o'],
                                high=item['h'],
                                low=item['l'],
                                volume=item['v'],
                                date_time=formatted_date,
                            )

                    messages.success(self.request, self.success_message)
                else:
                    messages.error(self.request, self.error_message)
            else:
                messages.error(self.request, self.error_message)
        else:
            messages.error(self.request, self.error_message)

        return redirect(self.success_url)


class SymbolCSVProcessView(ListView):
    success_message = "CSV Created Successfully."
    error_message = "Failed to Create CSV."
    success_url = reverse_lazy('nepse:csv.index')

    def get(self, request, *args, **kwargs):
        symbol = request.GET.get('symbol')
        checkSymbol = Symbol.objects.filter(symbol=symbol).first()
        checkSymbolInDatabase = Data.objects.filter(symbol=checkSymbol).first()
        if checkSymbol and checkSymbolInDatabase:
            items = Data.objects.filter(symbol=checkSymbol)

            folderName = symbol.lower()
            csv_directory = os.path.join(settings.MEDIA_ROOT + '\excel', folderName)
            if not os.path.exists(csv_directory):
                os.makedirs(csv_directory)

            filename = symbol.lower() + '_data.csv'
            file_path = os.path.join(csv_directory, filename)

            with open(file_path, 'w', newline='') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(['Date', 'Open', 'High', 'Low', 'Close', 'Volume'])
                for item in items:
                    writer.writerow(
                        [item.date_time.strftime('%Y-%m-%d'), item.opening, item.high, item.low, item.closing,
                         item.volume])

            messages.success(self.request, self.success_message)
        else:
            messages.error(self.request, self.error_message)

        return redirect(self.success_url)


def view_csv(request, pk):
    folder_name = pk.replace('_data.csv', '')
    csv_file = os.path.join(settings.MEDIA_ROOT + '/excel/' + folder_name, pk)

    if os.path.exists(csv_file):
        csv_data = []
        with open(csv_file, 'r') as file:
            reader = csv.reader(file)
            csv_data = list(reader)

        return render(request, 'backend/csv/view.html', {'csv_data': csv_data, 'title': folder_name.upper()})

    messages.error(request, 'CSV file not found.')
    return redirect(reverse_lazy('nepse:csv.index'))
