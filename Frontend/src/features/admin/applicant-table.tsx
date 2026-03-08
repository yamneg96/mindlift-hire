import { useMemo, useState } from "react"
import { ArrowUpDown, Search } from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Applicant } from "@/lib/mock-data"

const PAGE_SIZE = 5

export function ApplicantTable({
  items,
  onViewDetails,
}: {
  items: Applicant[]
  onViewDetails: (item: Applicant) => void
}) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "score">("score")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = items.filter((item) => {
      const matchQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || item.status === statusFilter
      return matchQuery && matchStatus
    })

    return [...base].sort((a, b) =>
      sortBy === "name" ? a.name.localeCompare(b.name) : b.score - a.score
    )
  }, [items, query, statusFilter, sortBy])

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-2.5 left-2 size-4 text-muted-foreground" />
            <Input
              className="h-9 pl-8"
              placeholder="Search by name, email, or role"
              value={query}
              onChange={(event) => {
                setPage(1)
                setQuery(event.target.value)
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setPage(1)
              setStatusFilter(value)
            }}
          >
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="gap-2"
            type="button"
            variant="outline"
            onClick={() =>
              setSortBy((prev) => (prev === "name" ? "score" : "name"))
            }
          >
            <ArrowUpDown className="size-4" />
            Sort: {sortBy === "name" ? "Name" : "Score"}
          </Button>
        </div>
      </div>

      <div className="hidden rounded-xl border border-border bg-card lg:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                  {new Date(item.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.score}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(item)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {pageItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">{item.name}</p>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-sm text-muted-foreground">{item.role}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(item.submittedAt).toLocaleDateString()}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Score: {item.score}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(item)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing {pageItems.length} of {filtered.length} applicants
        </p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  setPage((current) => Math.max(1, current - 1))
                }}
              />
            </PaginationItem>
            {[...Array(maxPage)].slice(0, 4).map((_, index) => {
              const value = index + 1
              return (
                <PaginationItem key={value}>
                  <PaginationLink
                    href="#"
                    isActive={value === page}
                    onClick={(event) => {
                      event.preventDefault()
                      setPage(value)
                    }}
                  >
                    {value}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  setPage((current) => Math.min(maxPage, current + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
