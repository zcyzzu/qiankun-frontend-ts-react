#!/bin/bash
###
 # @Author: liyou
 # @Date: 2021-12-27 09:46:20
 # @LastEditTime: 2021-12-27 09:46:20
 # @LastEditors: liyou
### 
set -e

toInject=""

# process env start with '__FE_'
for var in "${!__FE_@}"; do
    toInject="${toInject}window.${var}='${!var}';\n"
    # printf '%s=%s\n' "$var" "${!var}"
done

# print variables for review
printf 'Inject Variables:\n%b' $toInject

# inject to index.html
toInject="<script>\n${toInject}</script>\n"
sed -i'' -e "s/<!--DO_NOT_DELETE_ENV_CONFIG_INJECT_POINT-->/${toInject//\//\\/}/g" /usr/share/nginx/html/dist/index.html

exec "$@"
