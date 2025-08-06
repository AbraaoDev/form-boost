import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'
import { getProfile } from '@/http/get-profile'
import { logout } from '@/http/logout'

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const { isPending: isSigningOut, mutateAsync: handleSignOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/login', { replace: true })
    },
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-2"
          >
            {isLoadingProfile ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              profile?.user.name
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                {profile?.user.name}
                <span className="text-xs font-normal text-muted-foreground">
                  {profile?.user.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              disabled={isSigningOut}
            >
              <button className="w-full" onClick={() => handleSignOut()} >
                <LogOut className="mr-2 h-4 w-4 text-rose-500" />
                <span className='text-rose-500'>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}