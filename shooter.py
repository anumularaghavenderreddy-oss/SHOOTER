player = 5
enemy = 3

while True:
    print("\n" + "-" * 11)

    for i in range(11):
        if i == player and i == enemy:
            print("X", end="")
        elif i == player:
            print("A", end="")   # Player ship
        elif i == enemy:
            print("E", end="")   # Enemy
        else:
            print(".", end="")

    print("\n")

    move = input("a=left d=right s=shoot q=quit : ")

    if move == "a" and player > 0:
        player -= 1

    elif move == "d" and player < 10:
        player += 1

    elif move == "s":
        if player == enemy:
            print("🎯 Enemy Destroyed!")
            break
        else:
            print("Missed!")

    elif move == "q":
        break