import math


average_bet = float(input('Средний процент банка '))
winrate = float(input('Средний винрейт '))
average_coeff = float(input('Средний коэффициент '))
average_daily = int(input('Среднее число ставок в день '))

r = average_bet * (winrate * average_coeff - 1)
print('Прибавление банка за каждую ставку = ' + str(r))
print('Ожидаемый профит за месяц = ' + str(pow(r + 1, 30 * average_daily)))
print('Ожидаемый профит за полгода = ' + str(pow(r + 1, 180 * average_daily)))
print('Дней понадобится, чтобы увеличить банк в 100 раз: ' +
      str(math.log(100, r + 1) / average_daily))
