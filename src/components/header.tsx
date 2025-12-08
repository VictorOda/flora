import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dock, DockIcon } from "@/components/ui/dock";

export function Header() {
	return (
		<Dock className="w-full max-w-5xl bg-sidebar"
			leftChildren={<DockIcon>
				<Avatar>
					<AvatarImage src='' alt='User icon' />
					<AvatarFallback>U</AvatarFallback>
				</Avatar>
			</DockIcon>}
			rightChildren={
				<DockIcon className='mr-6'>
					<Button>+ Log</Button>
				</DockIcon>
			}
		>
			<DockIcon>
				Frends
			</DockIcon>
			<DockIcon>
				Diary
			</DockIcon>
			<DockIcon>
				Flora
			</DockIcon>
		</Dock>
	)
}
