import cmd

class BasicShell(cmd.Cmd):
    intro = 'Welcome to the basic shell. Type help or ? for a list of commands.'
    prompt = '-$'

    def do_greet(self, arg):
        """Greet the user. Usage: greet [name]"""
        if arg:
            print(f"Hello, {arg}!")
        else:
            print("Hello, stranger!")

    def do_bye(self, arg):
        """Exit the shell."""
        print("Bye!")
        return True # Returning True exits the cmdloop

    def do_EOF(self, arg):
        """Exit on Ctrl+D (EOF)."""
        return self.do_bye(arg)

if __name__ == '__main__':
    BasicShell().cmdloop()
