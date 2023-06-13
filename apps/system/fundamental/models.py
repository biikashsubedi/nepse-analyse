from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.system.data.models import Symbol


# Create your models here.
class FinancialData(models.Model):
    symbol = models.ForeignKey(Symbol, verbose_name=_('Symbol'), on_delete=models.CASCADE)
    date = models.DateTimeField(_('Date'), auto_now_add=True)
    quarter = models.CharField(_("Quarter"), max_length=200, blank=True, null=True)
    price = models.CharField(_("Price"), max_length=200, blank=True, null=True)
    year = models.CharField(_("Year"), max_length=200, blank=True, null=True)
    revenue = models.CharField(_("Revenue"), max_length=200, blank=True, null=True)
    earning_per_share = models.CharField(_("Earning Per Share EPS"), max_length=200, blank=True, null=True)
    dividends = models.CharField(_("Dividends"), max_length=200, blank=True, null=True)
    price_to_earnings_ratio = models.CharField(_("Price to earnings ratio"), max_length=200, blank=True, null=True)
    book_value_per_share = models.CharField(_("Book value per share"), max_length=200, blank=True, null=True)
    debt_to_equity_ratio = models.CharField(_("Debt to equity ratio"), max_length=200, blank=True, null=True)
    free_cash_flow = models.CharField(_("Free cash flow"), max_length=200, blank=True, null=True)
    return_on_equity = models.CharField(_("Return on equity"), max_length=200, blank=True, null=True)
    return_on_assets = models.CharField(_("Return on assets"), max_length=200, blank=True, null=True)
    gross_margin = models.CharField(_("Gross margin"), max_length=200, blank=True, null=True)
    operating_margin = models.CharField(_("Operating margin"), max_length=200, blank=True, null=True)
    net_margin = models.CharField(_("Net margin"), max_length=200, blank=True, null=True)
    current_ratio = models.CharField(_("Current ratio"), max_length=200, blank=True, null=True)
    quick_ratio = models.CharField(_("Quick ratio"), max_length=200, blank=True, null=True)
    earnings_growth_rate = models.CharField(_("Earnings growth rate"), max_length=200, blank=True, null=True)
    dividend_yield = models.CharField(_("Dividend yield"), max_length=200, blank=True, null=True)
    price_to_sales_ratio = models.CharField(_("Price to sales ratio"), max_length=200, blank=True, null=True)
    paid_up_capital = models.CharField(_("Paid up Capital"), max_length=200, blank=True, null=True)
    reserves_and_surplus = models.CharField(_("Reserves And Surplus"), max_length=200, blank=True, null=True)
    deposit = models.CharField(_("Deposit"), max_length=200, blank=True, null=True)
    non_performing_loan = models.CharField(_("Non Performing Loan"), max_length=200, blank=True, null=True)
    price_earning_to_growth = models.CharField(_("Price Earning To Growth PEG"), max_length=200, blank=True, null=True)
    investments = models.CharField(_("Investments"), max_length=200, blank=True, null=True)
    net_current_assets = models.CharField(_("Net Current Assets"), max_length=200, blank=True, null=True)
    net_fixed_assets = models.CharField(_("Net Fixed Assets"), max_length=200, blank=True, null=True)

    def __str__(self):
        return self.symbol

    class Meta:
        db_table = 'financial_data'
        verbose_name_plural = 'Financial Data'
