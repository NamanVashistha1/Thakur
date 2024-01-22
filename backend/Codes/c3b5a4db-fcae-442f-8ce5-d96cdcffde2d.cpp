#include<stdio.h>

int main(){

// iterate from i=1 to i=100
for (int i = 1; i <= 100; i++)
{
// if the number is divisible by 2 i.e. even
if (i % 2 == 0)
{
// print the number
printf("%d\n", i);
}
}
return 0;