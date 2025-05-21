psql -h localhost -U user -d mydatabase

--- esto me trae el numero de transacciones agrupadas por cliente y la sumatoria, descartando duplicados.

SELECT address, COUNT(*), sum(amount) 
FROM (
    SELECT DISTINCT txid, address,amount
    FROM transactions
    WHERE category = 'receive'
      AND confirmations >= 6
      AND address IN (
        'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ',
        'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp',
        'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n',
        '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo',
        'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8',
        'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM',
        'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'
      )
) AS unique_tx
GROUP BY address;


-----
Me trae la transaccion miníma y máxima 


SELECT 
  MIN(amount) AS min_amount,
  MAX(amount) AS max_amount
FROM (
    SELECT DISTINCT txid, address, amount
    FROM transactions
    WHERE category = 'receive'
      AND confirmations >= 6
      AND address IN (
        'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ',
        'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp',
        'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n',
        '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo',
        'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8',
        'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM',
        'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'
      )
) AS unique_tx;


con este query obtengo la transaccion para poderla validar:

(
  SELECT txid, amount AS value, 'min' AS type
  FROM (
      SELECT DISTINCT txid, address, amount
      FROM transactions
      WHERE category = 'receive'
        AND confirmations >= 6
        AND address IN (
          'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ',
          'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp',
          'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n',
          '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo',
          'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8',
          'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM',
          'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'
        )
  ) AS unique_tx
  ORDER BY amount ASC
  LIMIT 1
)
UNION ALL
(
  SELECT txid, amount AS value, 'max' AS type
  FROM (
      SELECT DISTINCT txid, address, amount
      FROM transactions
      WHERE category = 'receive'
        AND confirmations >= 6
        AND address IN (
          'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ',
          'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp',
          'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n',
          '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo',
          'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8',
          'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM',
          'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'
        )
  ) AS unique_tx
  ORDER BY amount DESC
  LIMIT 1
);



--- las que no estan asociados a un cliente conocido


SELECT COUNT(*), sum(amount) 
FROM (
    SELECT DISTINCT txid, address,amount
    FROM transactions
    WHERE category = 'receive'
      AND confirmations >= 6
      AND address NOT IN (
        'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ',
        'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp',
        'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n',
        '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo',
        'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8',
        'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM',
        'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV'
      )
) AS unique_tx;


-- JEST

npx jest --verbose
npx jest --onlyFailures